require('dotenv').config();
const { ApolloServer, gql, UserInputError } = require('apollo-server')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to MongoDB')
mongoose.connect(MONGODB_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true 
  }
  ).then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
})

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Book {
    title: String!
    author: Author!
    published: Int!
    id: ID!
    genres: [String!]!
  }
  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
  type Subscription {
    bookAdded: Book!
  }
`

const { PubSub } = require('apollo-server')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author && args.genre) {
        return await Book.find({ author: args.author, genre: { $in: [ args.genre ]} })
      }
      if (args.genre) {
        return await Book.find({ genres: { $in: [ args.genre ]} })
      }
      if (args.author) {
        return await Book.find({ author: args.author })
      }
      return await Book.find({})
    },
    allAuthors: async () => {
      console.log("Author.find")
      return Author.find({})
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Book: {
    author: (root) => Author.findById(root.author)
  },
  Author: {
    bookCount: async (root) => root.books.length
  },  
  Mutation: {
    createUser: (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      return user.save()
        .catch((error) => {
          throw new UserInputError(error.message, { invalidArgs: args, })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password != "www") {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.SECRET) }
    },
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        return null
      }      
      const author = await Author.findOne({ name: args.author })
      try {
        if (author === null) {
          const newAuthor = new Author({ name: args.author, books: []})
          console.log(newAuthor)
          const newBook = new Book({ ...args, author: newAuthor._id }) 
          newAuthor.books = [...newAuthor.books, newBook._id]
          await newAuthor.save()
          const uploadedBook = await newBook.save()

          pubsub.publish('BOOK_ADDED', { bookAdded: newBook})
          return uploadedBook
        }
        const newBook = new Book({ ...args, author: author._id }) 
        author.books = [...author.books, newBook._id]
        await author.save()
        const uploadedBook = await newBook.save()           
        pubsub.publish('BOOK_ADDED', { bookAdded: newBook})
        return uploadedBook     
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        return null
      }       
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      try {
        return author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => {
        return pubsub.asyncIterator(['BOOK_ADDED'])
      }
    },
  },  
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }  
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscription ready at ${subscriptionsUrl}`)
})
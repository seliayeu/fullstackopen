describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
      username: 'testuser',
      password: 'testpassword',
      name: 'Michael Stevenson'
    }

    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.get('form').contains('login')
    cy.get('form').contains('username')
    cy.get('form').contains('password')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('testpassword')
      cy.get('#login-button').click()

      cy.contains('Michael Stevenson logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('not a user')
      cy.get('#password').type('not a password')
      cy.get('#login-button').click()
    })

    it('has red notification upon failure', function() {
      cy.get('#username').type('not a user')
      cy.get('#password').type('not a password')
      cy.get('#login-button').click()

      cy.contains('wrong username or password')
      cy.get('#notification').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })
  describe.only('When logged in', function() {
    beforeEach(function() {
      cy.login('testuser', 'testpassword')
    })

    it('A blog can be created', function() {
      const blog = {
        title: 'the blog... yes.. the blog',
        author: 'michael michaelson',
        url: 'www.indeedIndeedIndeedIndeedIndeed.com',
      }

      cy.get('#togglable-show').click()
      cy.get('#title').type(blog.title)
      cy.get('#author').type(blog.author)
      cy.get('#url').type(blog.url)
      cy.get('#submit-blog').click()

      cy.contains(`${blog.title} by ${blog.author}`)
    })

    it('a blog can be liked', function() {
      const blog = {
        title: 'the blog... yes.. the blog',
        author: 'michael michaelson',
        url: 'www.indeedIndeedIndeedIndeedIndeed.com',
      }
      cy.createBlog(blog)
      cy.likeBlogFirst(blog)
      cy.contains('likes 1')
    })

    it('a blog\'s creator can delete it', function() {
      const blog = {
        title: 'the blog... yes.. the blog',
        author: 'michael michaelson',
        url: 'www.indeedIndeedIndeedIndeedIndeed.com',
      }

      cy.get('#togglable-show').click()
      cy.createBlog(blog)
      cy.get('#show-blog-info').click()
      cy.get('#remove-blog').click()
      cy.get('#root').not().contains(`${blog.title} by ${blog.author}`)
    })

    it('user who did not create blog cannot delete it', function() {
      const blog = {
        title: 'the blog... yes.. the blog',
        author: 'michael michaelson',
        url: 'www.indeedIndeedIndeedIndeedIndeed.com',
      }
      cy.createBlog(blog)
      cy.get('#logout-button').click()

      const user = {
        username: 'testuser2',
        password: 'testpassword',
        name: 'Michael Otherson'
      }
      cy.request('POST', 'http://localhost:3003/api/users', user)
      cy.login(user.username, user.password)

      cy.get('#show-blog-info').click()
      cy.get('#blog-list').not().should('not.contain', 'remove')
    })


    it('blogs are sorted by order of most likes', function () {
      const blog1 = {
        title: 'blog1',
        author: 'michael michaelson',
        url: 'www.indeedIndeedIndeedIndeedIndeed.com',
      }
      const blog2 = {
        title: 'blog2',
        author: 'michael michaelson',
        url: 'www.indeedIndeedIndeedIndeedIndeed.com',
      }
      const blog3 = {
        title: 'blog3',
        author: 'michael michaelson',
        url: 'www.indeedIndeedIndeedIndeedIndeed.com',
      }
      const blog4 = {
        title: 'blog4',
        author: 'michael michaelson',
        url: 'www.indeedIndeedIndeedIndeedIndeed.com',
      }
      cy.createBlog(blog1)
      cy.createBlog(blog2)
      cy.createBlog(blog3)
      cy.createBlog(blog4)

      cy.likeBlogFirst(blog1)
      cy.likeBlogFirst(blog2)
      cy.likeBlog(blog2)
      cy.likeBlogFirst(blog3)
      for (let i = 0; i < 2; i++) {
        cy.likeBlog(blog3)
      }
      cy.likeBlogFirst(blog4)
      for (let i = 0; i < 3; i++) {
        cy.likeBlog(blog4)
      }

      cy.get('#blog-list').children().should((blogs) => {
        let blogLikeObjArray = blogs.map((index, element) => {return { 'text': element.firstChild.innerText, 'likes': parseInt(element.children[2].children[1].childNodes[1].nodeValue) }})
        blogLikeObjArray = [blogLikeObjArray[0], blogLikeObjArray[1], blogLikeObjArray[2], blogLikeObjArray[3]]
        const sorted = [...blogLikeObjArray].sort((a, b) => b.likes - a.likes)
        expect(blogLikeObjArray).to.deep.eq(sorted)
      })
    })
  })
})

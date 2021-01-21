import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { useQuery, useMutation } from '@apollo/client';
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK, UPDATE_BORN } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const allAuthorsResult = useQuery(ALL_AUTHORS) 
  const allBooksResult = useQuery(ALL_BOOKS)

  const [ createBook ] = useMutation(CREATE_BOOK, {
    refetchQueries: [ { query: ALL_BOOKS }, { query: ALL_AUTHORS } ]
  })

  const [ updateBorn ] = useMutation(UPDATE_BORN, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors
        show={page === 'authors'} result={allAuthorsResult} updateBorn={updateBorn}
      />

      <Books
        show={page === 'books'} result={allBooksResult}
      />

      <NewBook
        show={page === 'add'} createBook={createBook}
      />

    </div>
  )
}

export default App
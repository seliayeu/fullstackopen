import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client';
import { BOOKS_FROM_GENRE } from '../queries'

const Books = ({ show, result }) => {
  const [booksFromGenre, genreResult] = useLazyQuery(BOOKS_FROM_GENRE, { fetchPolicy: 'no-cache' } ) 
  const [shownBooks, setShownBooks] = useState(undefined)
  const [genre, setGenre] = useState('')

  useEffect(() => {
    if(genreResult.called && !genreResult.loading) {
      console.log(genreResult)
      setShownBooks(genreResult.data.allBooks)
    }
  }, [genreResult])

  useEffect(() => {
    if(genreResult.called && !genreResult.loading && !result.loading) {
      console.log('neat!')
      booksFromGenre({ variables: { genre } })
    }
  }, [result]) //eslint-disable-line

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks

  let temp = []
  books.forEach((book) => {
    temp = temp.concat(book.genres)
  })
  const genres = [...new Set(temp)]

  const changeGenre = async (genre) => {
    await booksFromGenre({ variables: { genre } })
    setGenre(genre)
  }

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          { !shownBooks ?
              books.map(a =>
                <tr key={a.title}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              )
            :
              shownBooks
                .map(a =>
                  <tr key={a.title}>
                    <td>{a.title}</td>
                    <td>{a.author.name}</td>
                    <td>{a.published}</td>
                  </tr>
              )
          }
        </tbody>
      </table>
      <div>
        {
          <>
          {
            genres.map((genre) => (
              <button key={genre} onClick={() => changeGenre(genre)}>{genre}</button>
            ))
          }
          <button onClick={() => setShownBooks(books)}>all genres</button>
          </>
        }
      </div>
    </div>
  )
}

export default Books
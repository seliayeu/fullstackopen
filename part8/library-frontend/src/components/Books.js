import React, { useState } from 'react'

const Books = ({ show, result }) => {
  const [genre, setGenre] = useState('')

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
          {books
            .filter((book) => {
              if (genre === '') {
                return true
              }
              return book.genres.includes(genre)
            })
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
              <button key={genre} onClick={() => setGenre(genre)}>{genre}</button>
            ))
          }
          <button onClick={() => setGenre('')}>all genres</button>
          </>
        }
      </div>
    </div>
  )
}

export default Books
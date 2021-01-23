import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client';
import { BOOKS_FROM_GENRE } from '../queries'

const Recommendations = ({ show, allBooksResult, favoriteResult}) => {
  const [booksFromGenre, genreResult] = useLazyQuery(BOOKS_FROM_GENRE, { fetchPolicy: 'no-cache' } ) 
  const [shownBooks, setShownBooks] = useState(undefined)

  useEffect(() => {
    if(!favoriteResult.loading && !allBooksResult.loading) {
      booksFromGenre({ variables: { genre: favoriteResult.data.me.favoriteGenre } })
      console.log(allBooksResult)
      console.log('pogChampion')
    }
  }, [favoriteResult, allBooksResult]) //eslint-disable-line

  useEffect(() => {
    if(genreResult.called && !genreResult.loading) {
      console.log(genreResult.data.allBooks)
      setShownBooks(genreResult.data.allBooks)
    }
  }, [genreResult])

  if (!show) {
    return null
  }

  if (allBooksResult.loading || favoriteResult.loading) {
    return <div>loading...</div>
  }
  return (
    <div>
      <h2>recommendations</h2>
      <br></br>
      <div>books in your favorite genre <b>{favoriteResult.data.me.favoriteGenre}</b></div>
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
          { genreResult.loading || shownBooks === undefined ?
              <tr>loading...</tr>
              :
              shownBooks
                .map((book) =>
                  <tr key={book.title}>
                    <td>{book.title}</td>
                    <td>{book.author.name}</td>
                    <td>{book.published}</td>
                  </tr>
                )
          }
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
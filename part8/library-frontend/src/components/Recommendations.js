import React from 'react'

const Recommendations = ({ show, allBooksResult, favoriteResult}) => {
  if (!show) {
    return null
  }

  if (allBooksResult.loading || favoriteResult.loading) {
    return <div>loading...</div>
  }

  const books = allBooksResult.data.allBooks
  console.log(books)
  const favorite = favoriteResult.data.me.favoriteGenre

  return (
    <div>
      <h2>recommendations</h2>
      <br></br>
      <div>books in your favorite genre <b>{favorite}</b></div>
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
            .filter((book) => book.genres.includes(favorite))
            .map((book) =>
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
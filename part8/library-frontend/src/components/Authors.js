import React, { useState } from 'react'
import Select from 'react-select'

const Authors = ({ show, result, updateBorn }) => {
  const [born, setBorn] = useState('')
  const [selectedOption, setSelectedOption] = useState(null)

  if (!show) {
    return null
  }  

  if (result.loading) {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors
  const options = authors.map((author) => ({ value: author.name, label: author.name }))

  const updateAuthor = async (event) => {
    event.preventDefault()
    console.log(selectedOption)
    updateBorn({ variables: { name: selectedOption.value, born: parseInt(born) }})
    setSelectedOption(null)
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h2>set birthyear</h2>
      <Select
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={options}      
      />
      <form onSubmit={updateAuthor}>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>        
        <button type='submit'>update</button>
      </form>
    </div>
  )
}

export default Authors

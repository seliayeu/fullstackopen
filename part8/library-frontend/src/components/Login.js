import React, { useState } from 'react'

const Login = ({ show, login, setToken, setPage }) => {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  if (!show) {
    return null
  }

  const onLogin = async (event) => {
    event.preventDefault()
    const result = await login({ variables: { username, password } })
    const token = result.data.login.value
    setToken(token)
    localStorage.setItem('library-user-token', token)
    setPage('authors')
  }

  return (
    <div>
      <form onSubmit={onLogin}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}


export default Login
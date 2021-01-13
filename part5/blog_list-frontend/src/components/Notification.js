import React from 'react'

const Notification = ({ message, error }) => {
  console.log(message)
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }
  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (message === null) {
    return null
  }

  if (error) {
    return (
      <div style={errorStyle} id='notification'>
        {message}
      </div>
    )
  } else {
    return (
      <div style={notificationStyle} id='notification'>
        {message}
      </div>
    )
  }
}

export default Notification
import React from 'react'
import { Form, Button } from 'react-bootstrap'

const LoginForm = ({ handleLogin, }) => (
  <Form onSubmit={handleLogin}>
    <h2>login</h2>
    <Form.Group>
      <Form.Label>username</Form.Label>
      <Form.Control
        id='username'
        type='text'
        name='Username'
      />
    </Form.Group>
    <Form.Group>
      <Form.Label>password</Form.Label>
      <Form.Control
        id='password'
        type='text'
        name='Password'
      />
      <Button variant="primary" type="submit">login</Button>
    </Form.Group>
  </Form>
)

export default LoginForm
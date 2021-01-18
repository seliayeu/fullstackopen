import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('blog creation calls handler appropriatly', () => {
  const addBlog = jest.fn()

  const component = render (
    <BlogForm addBlog={addBlog} />
  )

  const form = component.container.querySelector('form')

  const authorInput = component.container.querySelector('#author')
  const titleInput = component.container.querySelector('#title')
  const urlInput = component.container.querySelector('#url')

  const testBlog = {
    author: 'cool name',
    title: 'cool title',
    url: 'cool url',
  }

  fireEvent.change(authorInput, { target: { value: 'cool name' } })
  fireEvent.change(titleInput, { target: { value: 'cool title' } })
  fireEvent.change(urlInput, { target: { value: 'cool url' } })

  fireEvent.submit(form)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0]).toEqual(testBlog)
})

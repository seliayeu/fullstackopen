import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('renders title of blog and author by default', () => {
  const blog = {
    title: 'why the word cooll is cool',
    author: 'thomas',
    url: 'green_mean.machine',
  }

  const tempFunc1 = (blog) => {
  }

  const tempFunc2 = (blog) => {
  }

  const user = {
    username: 'tempuser',
    name: 'thimaty',
    token: 'faketoken',
  }

  const component = render(
    <Blog blog={blog} incrementLikes={tempFunc1} deleteBlog={tempFunc2} user={user} />
  )

  expect(component.container).toHaveTextContent('why the word cooll is cool')
  expect(component.container).toHaveTextContent('thomas')
  expect(component.container).not.toHaveTextContent('green_mean.machine')
  expect(component.container).not.toHaveTextContent('likes')
})

test('clicking show reveals hidden components', () => {
  const blog = {
    title: 'why the word cooll is cool',
    author: 'thomas',
    url: 'green_mean.machine',
  }

  const tempFunc1 = (blog) => {
  }

  const tempFunc2 = (blog) => {
  }

  const user = {
    username: 'tempuser',
    name: 'thimaty',
    token: 'faketoken',
  }
  const component = render(
    <Blog blog={blog} incrementLikes={tempFunc1} deleteBlog={tempFunc2} user={user} />
  )

  const showButton = component.getByText('show')
  expect(component.container).not.toHaveTextContent('green_mean.machine')
  expect(component.container).not.toHaveTextContent('likes')
  fireEvent.click(showButton)
  expect(component.container).toHaveTextContent('green_mean.machine')
  expect(component.container).toHaveTextContent('likes')

})

test('clicking the like button twice triggers the event handler twice', () => {
  const blog = {
    title: 'why the word cooll is cool',
    author: 'thomas',
    url: 'green_mean.machine',
  }

  const tempFunc1 = (blog) => {
  }

  const mockIncrLikes = jest.fn()

  const user = {
    username: 'tempuser',
    name: 'thimaty',
    token: 'faketoken',
  }
  const component = render(
    <Blog blog={blog} incrementLikes={mockIncrLikes} deleteBlog={tempFunc1} user={user} />
  )
  const showButton = component.getByText('show')
  fireEvent.click(showButton)
  const likeButton = component.getByText('like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(mockIncrLikes.mock.calls).toHaveLength(2)
})
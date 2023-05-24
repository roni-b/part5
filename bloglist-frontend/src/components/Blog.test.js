import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
  }

  render(<Blog blog={blog}/>)
  const title = screen.getByText(/Component testing is done with react-testing-library/)
  expect(title).toBeDefined()
})

test('shows more info if button is pressed', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Joku',
    url: 'urlosoite',
    likes: 10,
    user: {
      username: 'Aku Ankka'
    }
  }

  const user = {
    username: 'Aku Ankka'
  }

  const handleUpdateLikes = jest.fn()
  const handleBlogRemove = jest.fn()

  render (
    <Blog blog={blog} handleUpdateLikes={handleUpdateLikes} handleBlogRemove={handleBlogRemove} user={user}/>
  )
  expect(screen.getByText(`${blog.title} ${blog.author}`)).toBeInTheDocument()
  expect(screen.getByText('view')).toBeInTheDocument()
  fireEvent.click(screen.getByText('view'))
  expect(screen.getByText(blog.url)).toBeInTheDocument()
  expect(screen.getByText(`${blog.likes}`)).toBeInTheDocument()
})

test('when like button is pressed twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Joku',
    url: 'urlosoite',
    likes: 0,
    user: {
      username: 'Aku Ankka'
    }
  }

  const user = {
    username: 'Aku Ankka'
  }

  const handleUpdateLikes = jest.fn()
  const handleBlogRemove = jest.fn()

  render (
    <Blog blog={blog} handleUpdateLikes={handleUpdateLikes} handleBlogRemove={handleBlogRemove} user={user}/>
  )

  fireEvent.click(screen.getByText('view'))
  fireEvent.click(screen.getByText('like'))
  expect(handleUpdateLikes.mock.calls).toHaveLength(1)
  fireEvent.click(screen.getByText('like'))
  expect(handleUpdateLikes.mock.calls).toHaveLength(2)
})
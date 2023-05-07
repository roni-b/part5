import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import LoginForm from './LoginForm'
import userEvent from '@testing-library/user-event'

test('<LoginForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const handleSubmit = jest.fn()
  const handleUsernameChange = jest.fn()
  const handlePasswordChange = jest.fn()

  render(<LoginForm handleSubmit={handleSubmit}
    handleUsernameChange={handleUsernameChange}
    handlePasswordChange={handlePasswordChange}
    username={''}
    password={''}
  />)

  const usernameInput = screen.getByPlaceholderText('username')
  const passwordInput = screen.getByPlaceholderText('password')
  const loginButton = screen.getByRole('button')

  await user.type(usernameInput, 'username')
  await user.type(passwordInput, 'password')
  await user.click(loginButton)

  expect(handleSubmit.mock.calls).toHaveLength(1)

})

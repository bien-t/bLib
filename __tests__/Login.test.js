import React from 'react'
import LoginForm from '../client/components/LoginForm'
import Login from '../client/components/Login'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import user from '@testing-library/user-event'

describe('Login Component test', () => {
    test('Renders LoginForm component', () => {
        render(
            <Login>
                <LoginForm />
            </Login>
        )
    })

    test('displays the heading', () => {
        render(
            <Login>
                <LoginForm />
            </Login>
        )
        const heading = screen.getByRole('heading', { name: /login/i })
        expect(heading).toBeInTheDocument()
    })

    test('displays email label', () => {
        render(
            <Login>
                <LoginForm />
            </Login>
        )
        const label = screen.getByLabelText(/email:/i)
        expect(label).toBeInTheDocument()
    })

    test('displays password label', () => {
        render(
            <Login>
                <LoginForm />
            </Login>
        )
        const label = screen.getByLabelText(/password:/i)
        expect(label).toBeInTheDocument()
    })

    test('displays login button', () => {
        render(
            <Login>
                <LoginForm />
            </Login>
        )
        const button = screen.getByRole('button', { name: /login/i })
        expect(button).toBeInTheDocument()
    })

    test('checks form input values', () => {
        render(
            <Login>
                <LoginForm />
            </Login>)

        const LoginFormInput = screen.getByRole('textbox', { name: /email/i })
        const passwordInput = screen.getByLabelText(/password:/i)
        expect(LoginFormInput).toBeInTheDocument()
        expect(passwordInput).toBeInTheDocument()
        user.type(LoginFormInput, 'test@test.pl')
        user.type(passwordInput, 'testpassword')
        expect(LoginFormInput).toHaveValue('test@test.pl')
        expect(passwordInput).toHaveValue('testpassword')
    })

    test('checks form invoke', () => {
        const mockHandleSubmit = jest.fn(event => event.preventDefault())
        const mockValuechange = jest.fn()
        const fakeState = {
            error: ''
        }
        render(
            <LoginForm handleValueChange={mockValuechange} handleSubmit={mockHandleSubmit} data={fakeState} />
        )
        const button = screen.getByRole('button', { name: /login/i, })
        user.click(button)

        expect(mockHandleSubmit).toHaveBeenCalled()
        expect(mockHandleSubmit).toHaveBeenCalledTimes(1)
    })
    test('checks if error message shows ', () => {
        const mockHandleSubmit = jest.fn()
        const mockValuechange = jest.fn()
        const fakeState = {
            error: 'Error message'
        }
        render(
            <LoginForm handleValueChange={mockValuechange} handleSubmit={mockHandleSubmit} data={fakeState} />
        )
        const error = screen.getByText(/error message/i)
        expect(error).toBeInTheDocument()
    })
})

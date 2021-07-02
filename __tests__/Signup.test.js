import React from 'react'
import Signupform from '../client/components/SignupForm'
import Signup from '../client/components/Signup'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import user from '@testing-library/user-event'

describe('Signup Component test', () => {

    test('renders SignupForm', () => {
        render(
            <Signup>
                <Signupform />
            </Signup>
        )
    })

    test('displays the heading', () => {
        render(
            <Signup>
                <Signupform />
            </Signup>
        )

        const heading = screen.getByRole('heading', { name: /Create a new account/i })
        expect(heading).toBeInTheDocument()
    })

    test('displays email label', () => {
        render(
            <Signup>
                <Signupform />
            </Signup>
        )
        const label = screen.getByLabelText(/email:/i)
        expect(label).toBeInTheDocument()
    })

    test('displays password label', () => {
        render(
            <Signup>
                <Signupform />
            </Signup>
        )
        const label = screen.getByLabelText(/password:/i)
        expect(label).toBeInTheDocument()
    })

    test('displays register button', () => {
        render(
            <Signup>
                <Signupform />
            </Signup>
        )
        const button = screen.getByRole('button', { name: /register/i })
        expect(button).toBeInTheDocument()
    })

    test('checks input values', () => {
        render(
            <Signup>
                <Signupform />
            </Signup>
        )

        const emailInput = screen.getByRole('textbox', { name: /email/i })
        const passwordInput = screen.getByLabelText(/password:/i)
        expect(emailInput).toBeInTheDocument()
        expect(passwordInput).toBeInTheDocument()
        user.type(emailInput, 'test@test.pl')
        user.type(passwordInput, 'password')
        expect(emailInput).toHaveValue('test@test.pl')
        expect(passwordInput).toHaveValue('password')
    })

    test('checks form invoke', () => {
        const mockHandleSubmit = jest.fn(event => event.preventDefault())
        const mockValuechange = jest.fn()
        const fakeState = {
            error: ''
        }

        render(
            <Signupform handleValueChange={mockValuechange} handleSubmit={mockHandleSubmit} data={fakeState} />
        )
        const button = screen.getByRole('button', { name: /register/i, })
        user.click(button)

        expect(mockHandleSubmit).toHaveBeenCalled()
        expect(mockHandleSubmit).toHaveBeenCalledTimes(1)
    })

    test('checks if error message shows ', () => {
        const mockHandleSubmit = jest.fn()
        const mockValuechange = jest.fn()
        const fakeState = {
            error: 'Error test message'
        }
        render(
            <Signupform handleValueChange={mockValuechange} handleSubmit={mockHandleSubmit} data={fakeState} />
        )
        const error = screen.getByText(/error test message/i)
        expect(error).toBeInTheDocument()
    })
})
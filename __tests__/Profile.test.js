import React from 'react'
import { render, screen } from '@testing-library/react'
import Profile from '../client/components/Profile'
import '@testing-library/jest-dom/extend-expect'
import user from '@testing-library/user-event'

import { BrowserRouter } from 'react-router-dom';
import "whatwg-fetch"
import { ProvideAuth } from '../client/components/api/api-auth'

import { rest } from 'msw'
import { setupServer } from 'msw/node'
import apiUser from '../client/components/api/api-user'


const handlers = [
    rest.get('http://localhost/api/user/undefined', (req, res, ctx) => {
        return res(
            ctx.json(
                {
                    _id: '89364782634872368742',
                    email: 'email@email.com',
                }
            ))
    })
]
const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const authentication = {
    id: "89364782634872368742"
}

describe('Profile component test', () => {
    test('renders profile component', () => {
        render(
            <ProvideAuth value={{ authentication }}>
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </ProvideAuth>
        )
    })

    test('displays the heading', async () => {
        render(
            <ProvideAuth value={{ authentication }}>
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </ProvideAuth>
        )

        const heading = screen.getByRole('heading', { name: /profile/i })
        expect(heading).toBeInTheDocument()
    })

    test('given data checks user information', async () => {
        render(
            <ProvideAuth value={{ authentication }}>
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </ProvideAuth>
        )
        expect(await screen.findByText(/user id: 89364782634872368742/i)).toBeInTheDocument()
        expect(await screen.findByText(/email: email@email\.com/i)).toBeInTheDocument()
    })

    test('shows change email form', async () => {
        render(
            <ProvideAuth value={{ authentication }}>
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </ProvideAuth>
        )
        const changeEmail = await screen.findByRole('button', { name: 'Change', exact: true })
        expect(changeEmail).toBeInTheDocument()

        user.click(changeEmail)

        expect(screen.getByRole('heading', {
            name: /type your new email adress/i
        })).toBeInTheDocument()
    })

    test('checks change email form values', async () => {
        render(
            <ProvideAuth value={{ authentication }}>
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </ProvideAuth>
        )
        const changeEmail = await screen.findByRole('button', { name: 'Change', exact: true })

        user.click(changeEmail)

        const emailInput = screen.getByLabelText('Email:')
        expect(emailInput).toBeInTheDocument()
        user.type(emailInput, 'email@email.com')
        expect(emailInput).toHaveValue('email@email.com')

        const confirmationInput = screen.getByLabelText(/confirm your email:/i)
        expect(confirmationInput).toBeInTheDocument()
        user.type(confirmationInput, 'email@email.com')
        expect(confirmationInput).toHaveValue('email@email.com')
    })

    test('hides change email form', async () => {
        render(
            <ProvideAuth value={{ authentication }}>
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </ProvideAuth>
        )
        const changeEmail = await screen.findByRole('button', { name: 'Change', exact: true })

        user.click(changeEmail)
        const heading = screen.getByRole('heading', {
            name: /type your new email adress/i
        })
        expect(heading).toBeInTheDocument()

        const closeButton = screen.getByRole('button', {
            name: /x/i
        })
        user.click(closeButton)
        expect(heading).not.toBeInTheDocument()
    })

    test('invokes change email form', async () => {
        server.use(rest.put('http://localhost/api/user/undefined/email', (req, res, ctx) => {
            return res(
                ctx.json({ message: 'Email adress has been updated' })
            )
        }))

        render(
            <ProvideAuth value={{ authentication }}>
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </ProvideAuth>
        )

        const spy = jest.spyOn(apiUser, 'changeEmail')

        const changeEmailButton = await screen.findByRole('button', { name: 'Change', exact: true })
        user.click(changeEmailButton)

        const emailInput = screen.getByLabelText('Email:')
        user.type(emailInput, 'email@email.com')

        const confirmationInput = screen.getByLabelText(/confirm your email:/i)
        user.type(confirmationInput, 'email@email.com')

        const submitButton = screen.getByRole('button', {
            name: /submit/i
        })
        expect(submitButton).toBeInTheDocument()
        user.click(submitButton)

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith({
            email: 'email@email.com',
            emailConfirmation: 'email@email.com',

        }, { userId: undefined })
    })

    test('shows "change email form" message', async () => {
        render(
            <ProvideAuth value={{ authentication }}>
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </ProvideAuth>
        )

        const changeEmailButton = await screen.findByRole('button', { name: 'Change', exact: true })
        user.click(changeEmailButton)

        const submitButton = screen.getByRole('button', {
            name: /submit/i
        })

        user.click(submitButton)
        expect(screen.getByText(/Emails are different/i)).toBeInTheDocument()
    })

    test('shows change password form', async () => {
        render(
            <ProvideAuth value={{ authentication }}>
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </ProvideAuth>
        )
        const changePassword = await screen.findByRole('button', { name: /change password/i })
        expect(changePassword).toBeInTheDocument()

        user.click(changePassword)

        expect(screen.getByRole('heading', {
            name: /type your new password/i
        })).toBeInTheDocument()
    })

    test('checks change password form values', async () => {
        render(
            <ProvideAuth value={{ authentication }}>
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </ProvideAuth>
        )

        const changePassword = await screen.findByRole('button', { name: /change password/i })
        user.click(changePassword)

        const passwordInput = screen.getByLabelText('Password:')
        expect(passwordInput).toBeInTheDocument()
        user.type(passwordInput, '123456')
        expect(passwordInput).toHaveValue('123456')

        const confirmationInput = screen.getByLabelText(/confirm your password:/i)
        expect(confirmationInput).toBeInTheDocument()
        user.type(confirmationInput, '123456')
        expect(confirmationInput).toHaveValue('123456')
    })

    test('hides change password form', async () => {
        render(
            <ProvideAuth value={{ authentication }}>
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </ProvideAuth>

        )

        const changePassword = await screen.findByRole('button', { name: /change password/i })
        user.click(changePassword)

        const heading = screen.getByRole('heading', {
            name: /type your new password/i
        })
        expect(heading).toBeInTheDocument()

        const closeButton = screen.getByRole('button', {
            name: /x/i
        })
        user.click(closeButton)
        expect(heading).not.toBeInTheDocument()
    })

    test('invokes change password form', async () => {
        server.use(rest.put('http://localhost/api/user/undefined/password', (req, res, ctx) => {
            return res(
                ctx.json({ message: 'Password has been updated' })
            )
        }))

        render(
            <ProvideAuth value={{ authentication }}>
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </ProvideAuth>
        )

        const spy = jest.spyOn(apiUser, 'changePassword')

        const changePassword = await screen.findByRole('button', { name: /change password/i })

        user.click(changePassword)
        const passwordInput = screen.getByLabelText('Password:')
        user.type(passwordInput, '123456')

        const confirmationInput = screen.getByLabelText(/confirm your password:/i)
        user.type(confirmationInput, '123456')

        const submitButton = screen.getByRole('button', {
            name: /submit/i
        })

        expect(submitButton).toBeInTheDocument()
        user.click(submitButton)

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith({
            password: '123456',
            passwordConfirmation: '123456',

        }, { userId: undefined })
    })

    test('shows "change password form" message', async () => {
        render(
            <ProvideAuth value={{ authentication }}>
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </ProvideAuth>
        )

        const changePassword = await screen.findByRole('button', { name: /change password/i })
        user.click(changePassword)

        const submitButton = screen.getByRole('button', {
            name: /submit/i
        })

        user.click(submitButton)
        expect(screen.getByText(/passwords are different/i)).toBeInTheDocument()
    })

    test('shows "change password form" message', async () => {
        render(
            <ProvideAuth value={{ authentication }}>
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </ProvideAuth>
        )

        const changePassword = await screen.findByRole('button', { name: /change password/i })
        user.click(changePassword)

        const submitButton = screen.getByRole('button', {
            name: /submit/i
        })

        user.click(submitButton)
        expect(screen.getByText(/passwords are different/i)).toBeInTheDocument()
    })
})
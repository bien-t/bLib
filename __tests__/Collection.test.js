import React from 'react'
import { render, screen } from '@testing-library/react'
import Collection from '../client/components/Collection'
import '@testing-library/jest-dom/extend-expect'
import user from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom';
import "whatwg-fetch"


import { rest } from 'msw'
import { setupServer } from 'msw/node'
const server = setupServer(
    rest.post('http://localhost/api/user/collection/undefined', (req, res, ctx) => {
        return res(
            ctx.json(
                {
                    error:'No books'
                }
            ))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())



describe('Collection component test', () => {
    test('renders Collection component', () => {
        render(
            <BrowserRouter>
                <Collection />
            </BrowserRouter>
        )
    })

    test('displays the heading', () => {
        render(
            <BrowserRouter>
                <Collection />
            </BrowserRouter>
        )

        const heading = screen.getByRole('heading', { name: /My collection/i })
        expect(heading).toBeInTheDocument()
    })

    test('displays "filters" button', () => {
        render(
            <BrowserRouter>
                <Collection />
            </BrowserRouter>
        )
        const button = screen.getByRole('button', { name: /filters/i })
        expect(button).toBeInTheDocument()
    })

    test('displays and hides filters after button click', () => {
        render(
            <BrowserRouter>
                <Collection />
            </BrowserRouter>
        )
        const button = screen.getByRole('button', { name: /filters/i })
        user.click(button)

        const label = screen.getByText(/Status/i)
        expect(label).toBeInTheDocument()

        user.click(button)
        expect(label).not.toBeInTheDocument()

    })
    test('checks filter selection', () => {
        render(
            <BrowserRouter>
                <Collection />
            </BrowserRouter>
        )
        const button = screen.getByRole('button', { name: /filters/i })
        user.click(button)

        const allButton = screen.getByRole('radio', { name: /all/i })
        expect(allButton.checked).toEqual(true)

        const completedButton = screen.getByRole('radio', { name: /completed/i })
        expect(completedButton.checked).toEqual(false)
        user.click(completedButton)
        expect(completedButton.checked).toEqual(true)

        const planToReadButton = screen.getByRole('radio', { name: /plan to read/i })
        expect(planToReadButton.checked).toEqual(false)
        user.click(planToReadButton)
        expect(planToReadButton.checked).toEqual(true)

        const readingButton = screen.getByRole('radio', { name: /reading/i })
        expect(readingButton.checked).toEqual(false)
        user.click(readingButton)
        expect(readingButton.checked).toEqual(true)
    })

    test('shows error message', async () => {
        render(
            <BrowserRouter>
                <Collection />
            </BrowserRouter>
        )

        expect(await screen.findByText(/No books/i)).toBeInTheDocument()
    })
})
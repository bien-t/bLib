import React from 'react'
import { render, screen } from '@testing-library/react'
import Search from '../client/components/Search'
import '@testing-library/jest-dom/extend-expect'
import user from '@testing-library/user-event'

import { rest } from 'msw'
import { setupServer } from 'msw/node'
import "whatwg-fetch"
import { BrowserRouter } from 'react-router-dom';

const server = setupServer(rest.post('http://localhost/api/search', (req, res, ctx) => {
    return res(
        ctx.json(
            [
                {
                    authors: [{ _id: "60be1f3390fa0d00158bc341", name: "Andrzej Sapkowski" }],
                    _id: "60be1f3390fa0d00158bc340",
                    title: "Ostatnie życzenie. Wiedźmin. Tom 1",
                    isbn: 9788375780635,
                    pages: 332,
                    description: "Pierwsza część ponadczasowej sagi wiedźmińskiej.",
                    imgPath: "https://bigimg.taniaksiazka.pl/images/popups/123/68007901377KS.jpg"
                }]
        ))
}))

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Search component test', () => {
    test('renders MainPage component', () => {
        render(<Search />)
    })

    test('displays the heading', () => {
        render(<Search />)

        const heading = screen.getByRole('heading', { name: /Search/i })
        expect(heading).toBeInTheDocument()
    })

    test('checks search bar value', () => {
        render(<Search />)
        const searchBar = screen.getByRole('searchbox')
        user.type(searchBar, 'searchValue')

        expect(searchBar).toBeInTheDocument()
        expect(searchBar).toHaveValue('searchValue')
    })

    test('checks category selection', () => {
        render(<Search />)
        const byTitle = screen.getByRole('radio', { name: /book by title/i })
        expect(byTitle.checked).toEqual(false)
        user.click(byTitle)
        expect(byTitle.checked).toEqual(true)

        const byIsbn = screen.getByRole('radio', { name: /book by isbn/i })
        expect(byIsbn.checked).toEqual(false)
        user.click(byIsbn)
        expect(byIsbn.checked).toEqual(true)

        const byAuthor = screen.getByRole('radio', { name: /author/i })
        expect(byAuthor.checked).toEqual(false)
        user.click(byAuthor)
        expect(byAuthor.checked).toEqual(true)
    })

    test('given data, checks search by book render', async () => {
        render(
            <BrowserRouter>
                <Search />
            </BrowserRouter>
        )
        const byTitle = screen.getByRole('radio', { name: /book by title/i })
        const searchBar = screen.getByRole('searchbox')

        user.click(byTitle)
        user.type(searchBar, 'ostatnie {enter}')

        expect(await screen.findByRole('link', { name: /ostatnie życzenie/i })).toBeInTheDocument()
        expect(await screen.findByRole('img')).toBeInTheDocument()
        expect(await screen.findByRole('link', { name: /andrzej sapkowski/i }))

    })

    test('given data, checks search by isbn render', async () => {
        render(
            <BrowserRouter>
                <Search />
            </BrowserRouter>
        )
        const byIsbn = screen.getByRole('radio', { name: /book by isbn/i })
        const searchBar = screen.getByRole('searchbox')

        user.click(byIsbn)
        user.type(searchBar, 'ostatnie {enter}')

        expect(await screen.findByRole('link', { name: /ostatnie życzenie/i })).toBeInTheDocument()
        expect(await screen.findByRole('img')).toBeInTheDocument()
        expect(await screen.findByRole('link', { name: /andrzej sapkowski/i }))

    })

    test('given data, checks search by author render', async () => {
        server.use(rest.post('http://localhost/api/search', (req, res, ctx) => {
            return res(
                ctx.json(
                    [
                        {
                            books: [{
                                _id: "60be1f3390fa0d00158bc340",
                                title: "Ostatnie życzenie. Wiedźmin. Tom 1",
                                isbn: 9788375780635,
                                imgPath: "https://bigimg.taniaksiazka.pl/images/popups/123/68007901377KS.jpg"
                            },
                            ],
                            _id: "60be1f3390fa0d00158bc341",
                            name: "Andrzej Sapkowski"
                        }]
                ))
        }))
        render(
            <BrowserRouter>
                <Search />
            </BrowserRouter>
        )
        const byAuthor = screen.getByRole('radio', { name: /author/i })
        const searchBar = screen.getByRole('searchbox')

        user.click(byAuthor)
        user.type(searchBar, 'sapkow {enter}')

        expect(await screen.findByRole('link', { name: /andrzej sapkowski/i }))
    })

    test('given empty search request, shows error message', () => {
        render(<Search />)
        const searchBar = screen.getByRole('searchbox')
        const byTitle = screen.getByRole('radio', { name: /book by title/i })
        user.click(byTitle)
        user.type(searchBar, '{enter}')
        expect(screen.getByText(/Error: check the search value or category selection/i)).toBeInTheDocument()
    })
    
    test('given empty category, shows error message', () => {
        render(<Search />)
        const searchBar = screen.getByRole('searchbox')
        user.type(searchBar, 'ostatnie {enter}')
        expect(screen.getByText(/Error: check the search value or category selection/i)).toBeInTheDocument()
    })
})


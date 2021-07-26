import React from 'react'
import { render, screen } from '@testing-library/react'
import Library from '../client/components/Library'
import '@testing-library/jest-dom/extend-expect'
import user from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom';
import "whatwg-fetch"
import apiLibrary from '../client/components/api/api-library'
import { rest } from 'msw'
import { setupServer } from 'msw/node'


const server = setupServer(rest.post('http://localhost/api/addBook', (req, res, ctx) => {
    return res(
        ctx.json(
            {
                error: 'Error message'
            }
        ))
})
    , rest.post('http://localhost/api/books', (req, res, ctx) => {
        return res(
            ctx.json(
                {
                    error: 'data error'
                }
            ))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Library component test', () => {
    test('renders Libray component', () => {
        render(
            <BrowserRouter>
                <Library />
            </BrowserRouter>
        )
    })

    test('displays the heading', () => {
        render(
            <BrowserRouter>
                <Library />
            </BrowserRouter>
        )

        const heading = screen.getByRole('heading', { name: /Library/i })
        expect(heading).toBeInTheDocument()
    })

    test('displays "add a new book" button', () => {
        render(
            <BrowserRouter>
                <Library />
            </BrowserRouter>
        )
        const button = screen.getByRole('button', { name: /add a new book/i })
        expect(button).toBeInTheDocument()
    })

    test('displays and hides form after button click', () => {
        render(
            <BrowserRouter>
                <Library />
            </BrowserRouter>
        )
        const button = screen.getByRole('button', { name: /add a new book/i })
        user.click(button)
        const listItem1 = screen.getByText(/ISBN: accepts only 13 characters number, e.g. 1234567891234/i)
        const listItem2 = screen.getByText(/Author: if more than one, split them with ";", e.g. Author 1; Author 2/i)

        expect(listItem1).toBeInTheDocument()
        expect(listItem2).toBeInTheDocument()

        user.click(button)
        expect(listItem1).not.toBeInTheDocument()
        expect(listItem2).not.toBeInTheDocument()

    })

    test('displays form fields', () => {
        render(
            <BrowserRouter>
                <Library />
            </BrowserRouter>
        )
        const button = screen.getByRole('button', { name: /add a new book/i })
        user.click(button)

        const title = screen.getByLabelText(/title/i)
        expect(title).toBeInTheDocument()

        const isbn = screen.getByLabelText(/isbn number/i)
        expect(isbn).toBeInTheDocument()

        const author = screen.getByLabelText(/author/i)
        expect(author).toBeInTheDocument()

        const pages = screen.getByLabelText(/pages/i)
        expect(pages).toBeInTheDocument()

        const bookCover = screen.getByText(/book cover/i)
        expect(bookCover).toBeInTheDocument()

        const coverUpload = screen.getByRole('radio', { name: /image upload/i })
        expect(coverUpload.checked).toEqual(false)
        expect(coverUpload).toBeInTheDocument()
        user.click(coverUpload)
        expect(coverUpload.checked).toEqual(true)
        const fileUpload = screen.getByTestId('coverUpload')
        expect(fileUpload).toBeInTheDocument()

        const coverUrl = screen.getByRole('radio', { name: /image url/i })
        expect(coverUrl).toBeInTheDocument()
        expect(coverUrl.checked).toEqual(false)
        user.click(coverUrl)
        expect(coverUrl.checked).toEqual(true)
        const fileUrl = screen.getByTestId('coverUrl')
        expect(fileUrl).toBeInTheDocument()

        const description = screen.getByLabelText(/Book description/i)
        expect(description).toBeInTheDocument()
    })

    test('checks form values', () => {
        render(
            <BrowserRouter>
                <Library />
            </BrowserRouter>
        )
        const button = screen.getByRole('button', { name: /add a new book/i })
        user.click(button)

        const title = screen.getByLabelText(/title/i)
        user.type(title, 'Book title')
        expect(title).toHaveValue('Book title')

        const isbn = screen.getByLabelText(/isbn number/i)
        user.type(isbn, '1234567891123')
        expect(isbn).toHaveValue('1234567891123')

        const author = screen.getByLabelText(/author/i)
        user.type(author, 'author')
        expect(author).toHaveValue('author')

        const pages = screen.getByLabelText(/pages/i)
        user.type(pages, '333')
        expect(pages).toHaveValue('333')

        const description = screen.getByLabelText(/Book description/i)
        user.type(description, 'short book description')
        expect(description).toHaveValue('short book description')

        const fileUrl = screen.getByTestId('coverUrl')
        user.type(fileUrl, 'https://exampleurl.com')
        expect(fileUrl).toHaveValue('https://exampleurl.com')

        const coverUpload = screen.getByRole('radio', { name: /image upload/i })
        user.click(coverUpload)
        const fileUpload = screen.getByTestId('coverUpload')
        const file = new File(["test"], "test.png", { type: "image/png" });
        user.upload(fileUpload, file)
        expect(fileUpload.files[0]).toEqual(file)
    })
    test('checks form invoke', () => {
        render(
            <BrowserRouter>
                <Library />
            </BrowserRouter>
        )
        const button = screen.getByRole('button', { name: /add a new book/i })
        user.click(button)
        const logSpy = jest.spyOn(apiLibrary, 'addBook')
        const addButton = screen.getByRole('button', { name: 'Add', exact: true })
        user.click(addButton)
        expect(logSpy).toHaveBeenCalled()
        expect(logSpy).toHaveBeenCalledTimes(1)
    })

    test('shows error message', async () => {
        render(
            <BrowserRouter>
                <Library />
            </BrowserRouter >
        )
        const button = screen.getByRole('button', { name: /add a new book/i })
        user.click(button)

        const addButton = screen.getByRole('button', { name: 'Add', exact: true })
        user.click(addButton)
        expect(await screen.findByText(/Error message/i)).toBeInTheDocument()

    })

    test('shows success message', async () => {
        server.use(rest.post('http://localhost/api/addBook', (req, res, ctx) => {
            return res(
                ctx.json(

                    {
                        message: 'A new book has been added'
                    }

                ))
        }))

        render(
            <BrowserRouter>
                <Library />
            </BrowserRouter >
        )

        const button = screen.getByRole('button', { name: /add a new book/i })
        user.click(button)

        const addButton = screen.getByRole('button', { name: 'Add', exact: true })
        user.click(addButton)
        expect(await screen.findByText(/A new book has been added/i)).toBeInTheDocument()
    })
})
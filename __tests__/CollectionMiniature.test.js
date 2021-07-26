import React from 'react'
import { render, screen } from '@testing-library/react'
import CollectionMiniature from '../client/components/CollectionMiniature'
import '@testing-library/jest-dom/extend-expect'
import user from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom';
import "whatwg-fetch"

import { ProvideAuth } from '../client/components/api/api-auth'
import apiUser from '../client/components/api/api-user'


const books = {
    authors: [{ _id: "60be1f3390fa0d00158bc341", name: "Andrzej Sapkowski" }],
    _id: "60be1f3390fa0d00158bc340",
    title: "Ostatnie życzenie. Wiedźmin. Tom 1",
    isbn: 9788375780635,
    pages: 332,
    description: "Pierwsza część ponadczasowej sagi wiedźmińskiej.",
    imgPath: "https://bigimg.taniaksiazka.pl/images/popups/123/68007901377KS.jpg",
}

const status = {
    status: 'completed',
}

const authentication = {
    id: "89364782634872368742"
}

describe('CollectionMiniature component test', () => {
    test('renders CollectionMiniature component', () => {
        render(
            <ProvideAuth value={{ authentication }}>
                <BrowserRouter>
                    <CollectionMiniature book={books} status={status.status} />
                </BrowserRouter>
            </ProvideAuth>

        )
    })

    test('shows book data', () => {
        render(
            <ProvideAuth value={{ authentication }}>
                <BrowserRouter>
                    <CollectionMiniature book={books} status={status.status} />
                </BrowserRouter>
            </ProvideAuth>

        )
        const bookCover = screen.getByRole('img')
        expect(bookCover).toBeInTheDocument()

        const title = screen.getByText(/title:/i)
        expect(title).toBeInTheDocument()

        const titleLink = screen.getByRole('link', { name: /ostatnie życzenie\. wiedźmin\. tom 1/i })
        expect(titleLink).toHaveAttribute('href', `/book/${books.isbn}`)

        const authors = screen.getByText(/author\(s\):/i)
        expect(authors).toBeInTheDocument()

        const authorLink = screen.getByRole('link', { name: /andrzej sapkowski,/i })
        expect(authorLink).toHaveAttribute('href', `/author/${books.authors[0]._id}`)

        const isbn = screen.getByText(/isbn:/i)
        expect(isbn).toBeInTheDocument()

        const isbnLink = screen.getByRole('link', { name: /9788375780635/i })
        expect(isbnLink).toHaveAttribute('href', `/book/${books.isbn}`)

        const pageRegexp = new RegExp(`pages: ${books.pages}`, 'i')
        const pages = screen.getByText(pageRegexp)
        expect(pages).toBeInTheDocument()

        const statusRegexp = new RegExp(`status: ${status.status}`, 'i')
        const bookStatus = screen.getByText(statusRegexp)
        expect(bookStatus).toBeInTheDocument()

    })

    test('shows/hide change status options after "change status" button click', () => {
        render(
            <ProvideAuth value={{ authentication }}>
                <BrowserRouter>
                    <CollectionMiniature book={books} status={status.status} />
                </BrowserRouter>
            </ProvideAuth>

        )
        const statusButton = screen.getByRole('button', { name: /change status/i })
        expect(statusButton).toBeInTheDocument()
        user.click(statusButton)
        const select = screen.getByRole('combobox')
        expect(select).toBeInTheDocument()
        user.click(statusButton)
        expect(select).not.toBeInTheDocument()
    })

    test('checks status selection', () => {
        render(
            <ProvideAuth value={{ authentication }}>
                <BrowserRouter>
                    <CollectionMiniature book={books} status={status.status} />
                </BrowserRouter>
            </ProvideAuth>

        )
        const statusButton = screen.getByRole('button', { name: /change status/i })
        user.click(statusButton)
        const select = screen.getByRole('combobox')

        user.selectOptions(select, 'Completed')
        expect(screen.getByText('Completed').selected).toBeTruthy()

        user.selectOptions(select, 'Plan to read')
        expect(screen.getByText(/plan to read/i).selected).toBeTruthy()

        user.selectOptions(select, 'Reading')
        expect(screen.getByText(/reading/i).selected).toBeTruthy()
    })

    test('invokes status change', () => {
        render(
            <ProvideAuth value={{ authentication }}>
                <BrowserRouter>
                    <CollectionMiniature book={books} status={status.status} />
                </BrowserRouter>
            </ProvideAuth>

        )
        const spy = jest.spyOn(apiUser, 'addToCollection')
        const statusButton = screen.getByRole('button', { name: /change status/i })
        user.click(statusButton)

        const changeButton = screen.getByRole('button', { name: 'Change', exact: true })
        expect(changeButton).toBeInTheDocument()
        const select = screen.getByRole('combobox')
        user.selectOptions(select, 'Reading')
        user.click(changeButton)

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledTimes(1)

    })

    test('invokes remove action',()=>{
        render(
            <ProvideAuth value={{ authentication }}>
                <BrowserRouter>
                    <CollectionMiniature book={books} status={status.status} />
                </BrowserRouter>
            </ProvideAuth>

        )
        const spy = jest.spyOn(apiUser, 'deleteFromCollection')
        const removeButton = screen.getByRole('button', { name: /remove from collection/i })
        expect(removeButton).toBeInTheDocument()
        user.click(removeButton)
        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledTimes(1)
    })
})
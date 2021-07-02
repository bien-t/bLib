import React from 'react'
import { render, screen } from '@testing-library/react'
import MainPage from '../client/components/MainPage'
import '@testing-library/jest-dom/extend-expect'


describe('MainPage component test',()=>{
    test('renders MainPage component',()=>{
        render(<MainPage />)
    })
    test('displays the heading', () => {
        render(<MainPage />)

        const heading = screen.getByRole('heading', { name: /Welcome/i })
        expect(heading).toBeInTheDocument()
    })
})
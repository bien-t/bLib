const addBook = async (book) => {
    try {
        let response = await fetch('/api/addBook', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: book
        })
        return await response.json()

    } catch (err) {
        console.log(err)
    }
}

const getBooks = async (pages, signal) => {
    try {
        let response = await fetch('/api/books', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pages),
            signal: signal
        })

        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

const getBookByIsbn = async (params, signal) => {
    try {
        let response = await fetch('/api/books/' + params.isbn, {
            method: 'GET',
            signal: signal,
            headers: {
                'Accept': 'application/json',
            }
        })

        return await response.json();
    } catch (err) {
        console.log(err)
    }
}

const searchBook = async (searchValues) => {
    try {
        let response = await fetch('/api/search', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchValues)
        })

        return await response.json()
    } catch (err) {
        console.log(err)
    }
}


export default {
    addBook,
    getBooks,
    getBookByIsbn,
    searchBook
}
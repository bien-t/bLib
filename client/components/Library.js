import React from 'react';
import LibraryMiniature from './LibraryMiniature';
import { createUseStyles } from 'react-jss'
import { useAuth } from './api/api-auth'
import { Link, useLocation } from 'react-router-dom'
import apiLibrary from './api/api-library';
import { colors } from '../styles/variables'
import { header, button, pagination } from '../styles/mixins'


const useStyles = createUseStyles({
    header: header(),
    library: {
        display: 'flex',
        columnGap: 10,
        rowGap: 10,
        justifyContent: 'center',
        maxWidth: 1400,
        flexWrap: 'wrap',
        margin: '0 auto',

    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    addForm: {
        display: 'flex',
        margin: '0 auto',
        justifyContent: 'space-between',
        marginBottom: 20,
        flexWrap: 'wrap',
        maxWidth: 650,
        '& input,textarea': {
            border: `1px solid ${colors.mainColor}`,
            padding: 5,
            color: colors.mainColor,
        },

        '& textarea': {
            resize: 'none',
            marginTop: 10,
            marginBottom: 10
        },
        '@media (max-width:650px)': {
            width: '80%',
            flexDirection: 'column'
        }
    },
    formInput: {
        maxWidth: 155,
        '@media (max-width:650px)': {
            maxWidth: '100%',
        }
    },
    formLabel: {
        display: 'flex',
        flexDirection: 'column',
        '& span': {
            textAlign: 'center'
        },
        '&:last-of-type': {
            marginTop: 10

        }
    },
    radio: {
        marginBottom: 10
    },
    button: button(5, 'auto', 'auto'),

    sButton: {
        marginBottom: 20,
        display: 'block',
    },
    pagination: pagination(),
    message: {
        display: 'block',
        textAlign: 'center',
        color: 'green',
        marginBottom: 15,
    },
    error: {
        display: 'block',
        textAlign: 'center',
        color: 'red',
        marginBottom: 15,

    },


})
function Library() {
    const auth = useAuth()
    const classes = useStyles()
    const location = useLocation()
    const [books, setBooks] = React.useState([])

    const [formValues, setFormValues] = React.useState({
        title: '',
        isbn: '',
        author: '',
        pages: null,
        description: '',
        show: false,
        image: null,
        url: ''
    });

    const [pagination, setPagination] = React.useState({
        totalPageNumber: [],
        pagesToShow: [],
        pagesLimit: 10,
        limit: 10,
        currentPage: parseInt(location.search.split('=')[1]) - 1 || 0,
        skip: 0
    })

    const [error, setError] = React.useState({
        error: '',
        showError: false
    })

    const [add, setAdd] = React.useState({
        added: false,
        showMessage: false,
        message: ''
    })

    const [coverSelect, setCover] = React.useState({
        cover: 'url'
    })

    const handleCoverChange = name => () => {
        setCover({ cover: name })
        if (name === 'upload') { setFormValues({ ...formValues, url: '' }) }
        if (name === 'url') { setFormValues({ ...formValues, image: null }) }
    }

    const changePage = currentPage => () => {
        setPagination({ ...pagination, currentPage: currentPage })
    }

    const handleAddClick = () => {
        setFormValues({ ...formValues, show: !formValues.show })
    }

    const handleAddChange = name => e => {
        const value = name === 'image' ? e.target.files[0] : e.target.value
        setFormValues({ ...formValues, [name]: value })
    }

    const handleAddSubmit = (e) => {
        e.preventDefault()
        let book = new FormData()
        book.append('title', formValues.title)
        book.append('isbn', formValues.isbn)
        book.append('author', formValues.author.split(';'))
        book.append('pages', formValues.pages)
        book.append('description', formValues.description)
        book.append('image', formValues.image)
        book.append('url', formValues.url)

        apiLibrary.addBook(book).then((data) => {
            if (data.error) {
                setError({ ...error, error: data.error, showError: true })
            } else if (data.message === 'A new book has been added') {
                setError({ ...error, showError: false })
                setAdd({ ...add, added: !add.added, showMessage: true, message: data })
                setFormValues({
                    title: '',
                    isbn: '',
                    author: '',
                    pages: null,
                    description: '',
                    show: false,
                    url: '',
                    image: null
                })
                setTimeout(() => {
                    setAdd({ ...add, showMessage: false })
                }, 1000)
            }
        })
    }

    React.useEffect(() => {
        setPagination({ ...pagination, currentPage: parseInt(location.search.split('=')[1]) - 1 || 0 })
    }, [location.search])

    React.useEffect(() => {
        const abort = new AbortController()
        const signal = abort.signal;
        const pages = {
            limit: pagination.limit,
            currentPage: pagination.currentPage < 0 ? pagination.currentPage = 0 : pagination.currentPage,
            skip: pagination.limit * pagination.currentPage
        }

        apiLibrary.getBooks(pages, signal).then((data => {
            if (data.error) {
                setError({ error: data.error })
            } else {
                setBooks(data.books)
                if (data.books.length === 0) {
                    setPagination({
                        ...pagination,
                        currentPage: Math.ceil(data.bLength / pagination.limit) - 1
                    })
                } else {
                    let totalPageNumber = [...Array(Math.ceil(data.bLength / pagination.limit))].map((el, index) => index);
                    setPagination({
                        ...pagination,
                        totalPageNumber: totalPageNumber,
                        pagesToShow:
                            totalPageNumber.length < pagination.pagesLimit ? totalPageNumber : totalPageNumber.slice(
                                pagination.currentPage - 2 < 0 ? 0 : pagination.currentPage + 2 >= totalPageNumber.length ? pagination.currentPage - 2 : pagination.currentPage - 1,
                                pagination.currentPage + pagination.pagesLimit > totalPageNumber.length ? totalPageNumber.length : pagination.currentPage + pagination.pagesLimit
                            )
                    })
                }
            }
        }))


        return function cleanup() {
            abort.abort()
        }

    }, [add.added, pagination.currentPage])

    React.useEffect(() => {
        if (error.error === 'You are not logged in') {
            auth.logout()
        }
    }, [error.error])



    const PageNumber = () => {
        return pagination.pagesToShow.map((el) => {
            return (<Link to={{
                search: `?page=${el + 1}`
            }} key={`page-${el}`} onClick={changePage(el)}>{el + 1} </Link>)
        })
    }


    return (
        <>
            <h2 className={classes.header}>Library</h2>
            <button className={`${classes.button} ${classes.sButton}`} type="button" onClick={handleAddClick}>Add a new book</button>
            {formValues.show &&
                <>
                    <ul className={classes.list}>
                        <li>ISBN: accepts only 13 characters number, e.g. 1234567891234</li>
                        <li>Author: if more than one, split them with 	&quot;;&quot;, e.g. Author 1; Author 2</li>
                    </ul>
                    <form className={classes.addForm} onSubmit={handleAddSubmit}>
                        <label className={classes.formLabel}>
                            <span>Title</span>
                            <input className={classes.formInput} type="text" placeholder="Title" onChange={handleAddChange('title')} name="title" required />
                        </label>
                        <label className={classes.formLabel}>
                            <span>ISBN number</span>
                            <input className={classes.formInput} type="text" placeholder="ISBN number" onChange={handleAddChange('isbn')} name="isbn_number" minLength="13" maxLength="13" required />
                        </label>
                        <label className={classes.formLabel}>
                            <span>Author</span>
                            <input className={classes.formInput} type="text" placeholder="Author" onChange={handleAddChange('author')} name="author" required />
                        </label>
                        <label className={classes.formLabel}>
                            <span>Pages</span>
                            <input className={classes.formInput} type="text" placeholder="Pages" onChange={handleAddChange('pages')} name="pages" required />
                        </label>
                        <label className={classes.formLabel} style={{ width: '100%' }}>
                            <span>Book cover</span>
                            <span className={classes.radio}>
                                <label><input type="radio" name="bookCover" onChange={handleCoverChange('upload')} checked={coverSelect.cover === "upload"} />Image upload</label>
                                <label><input type="radio" name="bookCover" onChange={handleCoverChange('url')} checked={coverSelect.cover === "url"} />Image url</label>
                            </span>
                            {coverSelect.cover === 'upload' &&
                                <input type="file" accept="image/*" onChange={handleAddChange('image')} required />
                            }
                            {coverSelect.cover === 'url' &&
                                <input type="text" onChange={handleAddChange('url')} placeholder="Paste a book cover link" required />
                            }
                        </label>
                        <label className={classes.formLabel} style={{ width: '100%' }}>
                            <span>Book description</span>
                            <textarea rows="10" placeholder="Book description" onChange={handleAddChange('description')} name="book_description"></textarea>
                        </label>

                        <button className={classes.button} type="submit">Add</button>
                    </form>
                </>
            }
            {add.showMessage &&
                <span className={classes.message}>{add.message.message}</span>
            }
            {error.showError &&
                <span className={classes.error}>{error.error}</span>
            }
            <div className={classes.library}>
                {books.map((book, index) => {
                    return (
                        <LibraryMiniature book={book} key={`book-${index}`} />
                    )
                })}
            </div>

            <div className={classes.pagination}>
                <PageNumber />
            </div>
        </>
    )
}


export default Library;
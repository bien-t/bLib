import React from 'react'
import { createUseStyles } from 'react-jss'
import { useParams } from 'react-router-dom'
import apiLib from './api/api-library'
import apiUser from './api/api-user'
import { Link } from 'react-router-dom'
import { useAuth } from './api/api-auth'
import { colors } from '../styles/variables'
import { button } from '../styles/mixins'


const useStyles = createUseStyles({
    bookContainer: {
        margin: '0 auto 20px auto',
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        maxWidth: 700,
        columnGap: 10,
        border: `2px solid ${colors.mainColor}`,
        '& img': {
            width: '100%',
            minHeight: 350,
            backgroundColor: 'gray',
        },
        '& button': button(5),
        '@media (max-width:700px)': {
            width: '90%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '& img': {
                backgroundColor: 'gray',
                width: '100%',
                height: '100%',

                maxHeight: 300,
                maxWidth: 200,
                marginTop: 10,
            }
        }
    },
    bookInfo: {
        marginTop: 20,
        paddingRight: 5,
        color: colors.mainColor,
        '& a': {
            textDecoration: 'none',
            color: colors.mainColor,
            fontWeight: 600,
            '&:hover': {
                textDecoration: 'underline'
            }
        },
        '@media (max-width:700px)': {
            textAlign: 'center',
            paddingLeft:5,
            paddingBottom:5
        },

    },
    description:{
        '@media (max-width:700px)': {
            display:'flex',
            flexWrap:'wrap',
            flexDirection:'column'
        },
    },
    form: {
        display: 'flex',
        marginBottom: 10,
        '& select': {
            marginRight: 10,
        },
        '@media (max-width:700px)': {
            justifyContent:'center'
        },

    },
    addButton: {
        margin: '10px 0'
    },
    error: {
        color: 'red',
    },
    message: {
        color: 'green',
    }
})
function Book() {
    const auth = useAuth()
    const classes = useStyles()
    const isbn = useParams()

    const [book, setBook] = React.useState({
        id: '',
        title: '',
        author: [],
        isbn: '',
        pages: null,
        description: '',
        imgPath: ''
    });
    const [user, setUser] = React.useState({
        id: '',
        books: [],
        show: true
    })

    const [error, setError] = React.useState({
        error: '',
    })

    const [form, setForm] = React.useState({
        show: false
    })

    const [message, setMessage] = React.useState({
        message: 'The book has been added to your collection',
        show: false
    })

    const handleClick = () => {
        setForm({
            show: !form.show,
            status: 'Completed'
        })
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            status: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const bookStatus = {
            bookId: book.id || null,
            status: form.status || null
        }
        apiUser.addToCollection(bookStatus, { userId: user.id }).then((data => {
            if (data.error) {
                setError({ error: data.error })
            } else {
                setForm({ show: false })
                setMessage({ ...message, show: true })
                setUser({ ...user, show: false })
                setTimeout(() => {
                    setMessage({ ...message, show: false })
                }, 1000)
            }
        }))
    }

    React.useEffect(() => {
        const abort = new AbortController()
        const signal = abort.signal;
        apiLib.getBookByIsbn(isbn, signal).then((data) => {
            if (data.book.error) {
                setError({ error: data.book.error })
            } else {
                setBook({
                    title: data.book.title,
                    author: data.book.authors,
                    isbn: data.book.isbn,
                    pages: data.book.pages,
                    id: data.book._id,
                    description: data.book.description,
                    imgPath: data.book.imgPath
                })
                setUser({
                    id: data.user[0]._id,
                    books: data.user[0].books,
                    show: data.user[0].books.length > 0 ? false : true
                })
            }
        })


        return function cleanup() {
            abort.abort()
        }
    }, [])

    React.useEffect(() => {
        if (error.error === 'You are not logged in') {
            auth.logout()
        }
    }, [error.error])

    return (
        <>
            {   book.error &&
                <span>{book.error}
                </span>}

            { !book.error && (
                < div className={classes.bookContainer} >
                    <img src={book.imgPath} alt="" />
                    <div className={classes.bookInfo}>
                        <div>
                            Title: {book.title}
                        </div>
                        <div>
                            Author(s): {book.author.map((author, index) => <Link key={`author-${index}`} to={`/author/${author._id}`}>{`${author.name}, `}</Link>)}
                        </div>
                        <div>
                            ISBN: {book.isbn}
                        </div>
                        <div>
                            Pages: {book.pages}
                        </div>
                        <div className={classes.description}>
                            <span>Description:</span> {book.description}
                        </div>
                        {user.show &&
                            <>
                                <button type="button" className={classes.addButton} onClick={handleClick}>Add to your collection</button>
                                {form.show &&
                                    <form onSubmit={handleSubmit} className={classes.form}>
                                        <select name="" id="" onChange={handleChange}>
                                            <option value="Completed">Completed</option>
                                            <option value="Plan to read">Plan to read</option>
                                            <option value="Reading">Reading</option>
                                        </select>
                                        <button type="submit">Add</button>
                                    </form>
                                }
                            </>
                        }
                        {error.error &&
                            <>
                                <br />
                                <span className={classes.error}>{error.error}</span>
                            </>
                        }
                        {message.show &&
                            <>
                                <br />
                                <span className={classes.message}>{message.message}</span>
                            </>
                        }
                    </div>
                </div>

            )
            }
        </>
    )
}


export default Book;
import React from 'react'
import { createUseStyles } from 'react-jss'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useAuth } from './api/api-auth'
import apiUser from './api/api-user'
import { colors } from '../styles/variables'
import { button } from '../styles/mixins'


const useStyles = createUseStyles({
    bookContainer: {
        margin: '0 auto 20px auto',
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        maxWidth: 600,
        columnGap: 10,
        border: `2px solid ${colors.mainColor}`,
        '& img': {
            width: '100%',
            minHeight: 300,
            height: '100%',
            backgroundColor: 'gray'
        },
        '@media (max-width:650px)': {
            width: '90%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '& a':{
                width: '100%',
                height: '100%',
                maxHeight: 300,
                maxWidth: 200,
                marginTop: 10,
                marginBottom:10,
            },
            '& img': {
                backgroundColor: 'gray'
            }
        }
    },
    bookInfo: {
        marginTop: 20,
        color: colors.mainColor,

        '& a': {
            textDecoration: 'none',
            color: colors.mainColor,
            fontWeight: 600,
            '&:hover': {
                textDecoration: 'underline'
            },
        },
        '@media (max-width:650px)': {
            textAlign: 'center',
            marginTop: 10,
        }
    },
    status: {
        display: 'flex',
        flexWrap: 'wrap',
        '& button': button(5, 'auto', 10),
        '@media (max-width:650px)': {
            flexDirection: 'column',
            alignItems: 'center',
            '& button': button(5, 0, 0),
        }
    },
    form: {
        display: 'flex',

        '& select': {
            marginRight: 10,
        },
        '@media (max-width:650px)': {
            marginTop: 10,
        }
    },
    message: {
        color: 'green',
        width: '100%',
    },
    removeButton: {
        marginTop: 20,
        marginBottom: 10
    }
})
function CollectionMiniature({ book, status, reload }) {
    const classes = useStyles()
    const auth = useAuth()
    const userId = useParams()
    const [form, setForm] = React.useState({
        show: false,
        tempStatus: status
    })

    const [message, setMessage] = React.useState({
        message: 'Status has been updated',
        show: false
    })

    const handleClick = (e) => {
        e.preventDefault()
        setForm({ ...form, show: !form.show })
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            tempStatus: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const bookStatus = {
            bookId: book._id || null,
            status: form.tempStatus
        }
        apiUser.addToCollection(bookStatus, userId).then((data => {
            if (data.error) {
                console.log(data.error)
            } else {
                setForm({ ...form, show: false })
                setMessage({ ...message, show: true })
                setTimeout(() => {
                    setMessage({ ...message, show: false })
                }, 1000)
                reload()
            }
        }))
    }

    const handleRemove = (e) => {
        e.preventDefault();
        apiUser.deleteFromCollection(userId, { bookId: book._id }).then((data) => {
            console.log(data.message)
            reload()
        })
    }

    return (
        <div className={classes.bookContainer}>
            <Link to={`/book/${book.isbn}`}>
                <img src={book.imgPath} alt="" />
            </Link>
            <div className={classes.bookInfo}>
                <div>
                    Title:
                    <Link to={`/book/${book.isbn}`}>
                        {book.title}
                    </Link>
                </div>
                <div>
                    Author(s): {book.authors.map((author, index) => <Link key={`author-${index}`} to={`/author/${author._id}`}>{`${author.name}, `}</Link>)}
                </div>
                <div>
                    ISBN:
                    <Link to={`/book/${book.isbn}`}>
                        {book.isbn}
                    </Link>
                </div>
                <div>
                    Pages: {book.pages}
                </div>
                <div className={classes.status}>
                    Status: {status}
                    {(auth.user._id === userId.userId) &&
                        <button onClick={handleClick}>Change status</button>
                    }
                    {form.show &&
                        <form className={classes.form} onSubmit={handleSubmit}>

                            <select onChange={handleChange} defaultValue={status}>
                                <option value="Completed">Completed</option>
                                <option value="Plan to read">Plan to read</option>
                                <option value="Reading">Reading</option>
                            </select>
                            <button type="submit">Change</button>
                        </form>
                    }

                    {message.show &&
                        <>
                            <br />
                            <span className={classes.message}>{message.message}</span>
                        </>
                    }
                    {(auth.user._id === userId.userId) &&
                        <button className={classes.removeButton} onClick={handleRemove}>Remove from collection</button>
                    }
                </div>
            </div>
        </div>
    )
}


export default CollectionMiniature;
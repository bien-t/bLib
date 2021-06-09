import React from 'react';
import { useParams } from 'react-router-dom'
import apiAuthor from './api/api-author'
import { createUseStyles } from 'react-jss'
import { Link } from 'react-router-dom'
import { useAuth } from './api/api-auth'
import { header } from '../styles/mixins';
import { colors } from '../styles/variables'



const useStyles = createUseStyles({
    header: header(),
    author: {
        display: 'flex',
        columnGap: 10,
        rowGap: 10,
        justifyContent: 'center',
        maxWidth: 1400,
        flexWrap: 'wrap',
        margin: '0 auto',

    },
    book: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 200,
        alignItems: 'center',
        border: `1px solid ${colors.mainColor}`,
        '& img': {
            width: 200,
            height: 300,
            backgroundColor: 'gray',
        },

    },
    text: {
        color: colors.mainColor,
        fontWeight: 600,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

        '& a': {
            textDecoration: 'none',
            color: colors.mainColor,
            textAlign:'center',
            '&:hover':{
                textDecoration:'underline'
            }
        }
    }
})

function Author() {
    const classes = useStyles()
    const authorId = useParams()
    const auth = useAuth()


    const [author, setAuthor] = React.useState({ books: [] })
    const [error, setError] = React.useState({})

    React.useEffect(() => {

        const abort = new AbortController()
        const signal = abort.signal;
        apiAuthor.getAuthorData(authorId, signal).then((data) => {
            if (data.error) {
                setError({ error: data.error })
            } else {
                setAuthor(data)
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
            <h2 className={classes.header}>{author.name} books</h2>
            <div className={classes.author}>
                {author.books.map((book, index) => {
                    return (
                        <div className={classes.book} key={`book-${index}`}>
                            <Link to={`/book/${book.isbn}`}>
                                <img src={book.imgPath} alt="" />
                            </Link>
                            <div className={classes.text}>
                                <Link to={`/book/${book.isbn}`}>

                                    {book.title}
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default Author;
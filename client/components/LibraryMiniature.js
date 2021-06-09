import React from 'react'
import { createUseStyles } from 'react-jss'
import { Link } from 'react-router-dom'
import { colors } from '../styles/variables'


const useStyles = createUseStyles({
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
function LibraryMiniature({ book }) {
    const classes = useStyles()

    return (
        <div className={classes.book}>
            <Link to={`/book/${book.isbn}`}>
                <img src={book.imgPath} alt="" />
            </Link>
            <div className={classes.text}>
                <Link to={`/book/${book.isbn}`}>
                    {book.title}
                </Link>
            </div>
            <div className={classes.text}>
                {book.authors.map((author, index) => {
                    return <Link key={`author-${index}`} to={`/author/${author._id}`}>{`${author.name} `}</Link>
                })}
            </div>
        </div>
    )
}


export default LibraryMiniature;
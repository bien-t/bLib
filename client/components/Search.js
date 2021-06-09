import React from 'react'
import { createUseStyles } from 'react-jss'
import { Link } from 'react-router-dom';
import { useAuth } from './api/api-auth'
import apiLibrary from './api/api-library'
import LibraryMiniature from './LibraryMiniature';
import { header, button} from '../styles/mixins'
import {colors} from '../styles/variables'

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

        '& span a': {
            textDecoration: 'none',
            color: colors.mainColor,
            fontSize: '2rem',
            '&:visited': {
                color: colors.visitedColor
            },
            '&:hover': {
                fontWeight: 'bold'
            }
        }
    },
    searchForm: {
        display: 'flex',
        maxWidth: 650,
        margin: '0 auto 20px auto',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& div': {
            width: '100%',
            textAlign: 'center',
            marginBottom: 10,
        },
        '& label': {
            color: colors.mainColor,


            '& input[type=radio]': {
                marginLeft: 20,

            },
            '&:first-of-type': {
                width: '100%',
                textAlign: 'center',
                '& input[type=search]': {
                    width: '100%',
                    border: `1px solid ${colors.mainColor}`,
                    color: colors.mainColor,
                    padding: 5,
                    '@media (max-width:650px)': {
                        width: '90%',
                    }
                }

            },
        }
    },
    button: button(5),
})



function Search() {
    const auth = useAuth()
    const classes = useStyles()

    const [returnedData, setReturnedData] = React.useState([])
    const [error, setError] = React.useState({
        error: '',
    })

    const [searchValues, setSearchValues] = React.useState({
        searchValue: '',
        searchCategory: '',
    })

    const handleSearchChange = (value) => (e) => {
        if (e.target.name === "searchOption") {
            setSearchValues({ ...searchValues, searchCategory: value })
        } else {
            setSearchValues({ ...searchValues, searchValue: e.target.value })
        }
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const search = {
            searchValue: searchValues.searchValue,
            searchCategory: searchValues.searchCategory
        }
        apiLibrary.searchBook(search).then(data => {
            if (data.error) {
                setError({ error: data.error })
            } else {
                setReturnedData(data)
            }
        })
    }

    React.useEffect(() => {
        if (error.error === 'You are not logged in') {
            auth.logout()
        }
    }, [error.error])

    return (
        <>
            <form className={classes.searchForm} onSubmit={handleSearchSubmit}>
                <label><h2 className={classes.header}>Search</h2><input type="search" id="" onChange={handleSearchChange()} /></label>
                <div>
                    <label><input type="radio" name="searchOption" id="" onChange={handleSearchChange('title')} />Book by Title</label>
                    <label><input type="radio" name="searchOption" id="" onChange={handleSearchChange('isbn')} />Book by ISBN</label>
                    <label><input type="radio" name="searchOption" id="" onChange={handleSearchChange('author')} />Author</label>
                </div>
                <button className={`${classes.button}`} type="submit">Submit</button>
            </form>
            <div className={classes.library}>

                {returnedData.map((data, index) => {
                    if (data.authors) {
                        return <LibraryMiniature book={data} key={`book-${index}`} />
                    } else {
                        return <span>
                            <Link to={`/author/${data._id}`} key={`authorLink-${index}`}>{`${data.name}`}</Link>
                        </span>
                    }
                })}
            </div>
        </>
    )
}

export default Search
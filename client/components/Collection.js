import React from 'react'
import { useParams, useLocation, useHistory } from 'react-router-dom'
import apiUser from './api/api-user'
import CollectionMiniature from './CollectionMiniature'
import { useAuth } from './api/api-auth'
import { createUseStyles } from 'react-jss'
import { colors } from '../styles/variables'
import { button, header, pagination } from '../styles/mixins'

const useStyles = createUseStyles({
    header: header(),
    pagination: pagination(),
    filterContainer: {
        display: 'grid',
        margin: '0 auto 20px auto',
        width: '100%',
        maxWidth: 600,
        gridTemplateColumns: 'repeat(3,200px)',
        gridTemplateRows: 'repeat(2,auto)',
        columnGap: 1,
        rowGap: 5,
        '@media (max-width:650px)': {
            width: '90%',
            gridTemplateColumns: 'repeat(3,minmax(auto,200px))',

        }
    },
    filter: {
        border: `2px solid ${colors.mainColor}`,
        display: 'flex',
        flexDirection: 'column',
        gridRowStart: 2,
        '& span': {
            textAlign: 'center'
        }
    },

    button: button(5),
    gridButton: {
        gridColumn: '1/4',

    }
})
function Collection() {
    const auth = useAuth()
    const classes = useStyles()
    const userId = useParams()
    const location = useLocation()
    const history = useHistory()


    const [books, setBooks] = React.useState([])
    const [error, setError] = React.useState({
        error: '',
    })
    const [reload, setReload] = React.useState({
        reload: false
    })

    let pageArray = location.search.split(/[.&=?]/)
    let pageNumber = pageArray[pageArray.indexOf('page') + 1]
    const [pagination, setPagination] = React.useState({
        totalPageNumber: [],
        pagesToShow: [],
        pagesLimit: 5,
        limit: 5,
        currentPage: parseInt(pageNumber - 1) || 0,
        skip: 0
    })

    let filterArray = location.search.split(/[.&=?]/).indexOf('filter') + 1
    const [filter, setFilter] = React.useState({
        show: false,
        status: filterArray === 0 ? 'All' : location.search.split(/[.&=?]/)[filterArray].replaceAll('+', ' ')
    })

    const addQuery = (values) => {
        let pathname = location.pathname;
        let searchParams = new URLSearchParams(location.search);
        values.forEach(element => {
            searchParams.set(element.key, element.value)
        });

        history.push({
            pathname: pathname,
            search: searchParams.toString()
        });
    };

    const handleFilterChange = (e) => {
        setFilter({ ...filter, status: e.target.value })
        setError('')
        addQuery([{ key: 'filter', value: e.target.value }, { key: 'page', value: 1 }])
        setReload({ reload: !reload.reload })
    }

    const changePage = page => (e) => {
        e.preventDefault()
        setPagination({ ...pagination, currentPage: page })
        addQuery([{key:'page', value:page + 1}])
    }

    const handleClick = () => {
        setFilter({
            ...filter,
            show: !filter.show
        })
    }

    React.useEffect(() => {
        setFilter({ ...filter, status: filterArray === 0 ? 'All' : location.search.split(/[.&=?]/)[filterArray].replaceAll('+', ' ') })
        setPagination({ ...pagination, currentPage: parseInt(pageNumber - 1) || 0 })
    }, [location.search])

    React.useEffect(() => {
        const pages = {
            limit: pagination.limit,
            currentPage: pagination.currentPage < 0 ? pagination.currentPage = 0 : pagination.currentPage,
            skip: pagination.limit * pagination.currentPage
        }

        apiUser.getUserCollection(userId, pages, { status: filter.status }).then((data => {
            if (data.error) {
                setError({ error: data.error })
                if (data.error === 'No books') {
                    setPagination({ ...pagination, pagesToShow: [], totalPageNumber: [] })
                    setBooks([])
                }
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
    }, [pagination.currentPage, reload.reload])

    React.useEffect(() => {
        if (error.error === 'You are not logged in') {
            auth.logout()
        }
    }, [error.error])

    return (
        <>
            <h2 className={classes.header}>My collection</h2>
            <div className={classes.filterContainer}>
                <button className={`${classes.button} ${classes.gridButton}`} onClick={handleClick} type="button">Filters</button>
                {
                    filter.show &&
                    <>
                        <div className={classes.filter}>
                            <span>Status:</span>
                            <label><input type="radio" value="All" onChange={handleFilterChange} checked={filter.status === "All"} />All</label>
                            <label><input type="radio" value="Completed" onChange={handleFilterChange} checked={filter.status === "Completed"} />Completed</label>
                            <label><input type="radio" value="Plan to read" onChange={handleFilterChange} checked={filter.status === "Plan to read"} />Plan to read</label>
                            <label><input type="radio" value="Reading" onChange={handleFilterChange} checked={filter.status === "Reading"} />Reading</label>
                        </div>
                        <div className={classes.filter}>

                        </div>
                        <div className={classes.filter}>

                        </div>
                    </>
                }
            </div>
            {error.error && <div style={{ textAlign: 'center', color: colors.mainColor }}>
                {error.error}
            </div>}
            {!error.error &&
                <>
                    {
                        books.map((book, index) => {
                            return (
                                <CollectionMiniature reload={() => setReload({ reload: !reload.reload })} book={book.bookId} status={book.status} key={`collM-${index}`} />
                            )
                        })
                    }
                </>
            }

            <div className={classes.pagination}>

                {pagination.pagesToShow.map((el) => {
                    return (<a
                        key={`page-${el}`} onClick={changePage(el)}>{el + 1} </a>)
                })
                }
            </div>
        </>
    )
}



export default Collection;
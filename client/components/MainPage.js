import React from 'react';
import { createUseStyles } from 'react-jss'
import { header } from '../styles/mixins';


const useStyles = createUseStyles({
    header: header()
})

function MainPage() {
    const classes = useStyles()
    return (
        <h1 className={classes.header}>Welcome</h1>
    )
}

export default MainPage;
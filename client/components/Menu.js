import React from 'react';
import { NavLink } from 'react-router-dom';
import { createUseStyles } from 'react-jss'
import { useAuth } from './api/api-auth';
import { colors } from '../styles/variables'

const useStyles = createUseStyles({
    navigation: {
        width: '100%',
        marginBottom: 50,
        paddingTop: 10,
        position: 'relative',
        '& ul': {
            display: 'flex',
            justifyContent: 'center',
            listStyleType: 'none',
            marginTop: 0,
            '&::after': {
                backgroundColor: colors.mainColor,
                width: '100%',
                height: 8,
                content: "''",
                display: 'block',
                position: 'absolute',
                bottom: 0,
                left: 0,
                zIndex: -1,
            },
            '& li': {
                display: 'flex',
                margin: {
                    right: 10,
                },
                width: 100,
                height: 40,
                backgroundColor: colors.mainColor,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: colors.hoverColor
                },
            },
            '& li a': {
                textDecoration: 'none',
                color: '#fff',
                width: '100%',
                height: '100%',
                textAlign: 'center',
                paddingTop: 8
            }
        }
    }
})



function Menu() {
    const auth = useAuth()
    const classes = useStyles();

    return (
        <div  className={classes.navigation}>
            <ul>
                        <li>
                            <NavLink to='/'>Home</NavLink>
                        </li>
                        {
                            !(auth && auth.user) &&
                            <>
                                <li>
                                    <NavLink to='/signup'>Sign up</NavLink>
                                </li>
                                <li>
                                    <NavLink to='/login'>Login</NavLink>
                                </li>
                            </>
                        }
                        {
                            (auth && auth.user) &&
                            <>
                                <li>
                                    <NavLink to='/search'>Search</NavLink>
                                </li>
                                <li>
                                    <NavLink to='/library'>Library</NavLink>
                                </li>
                                <li>
                                    <NavLink to={`/collection/user/${auth.user._id}`}>My collection</NavLink>
                                </li>
                                <li>
                                    <NavLink to='/profile'>Profile</NavLink>
                                </li>
                                <li>
                                    <a onClick={() => auth.logout()}>Logout</a>
                                </li>
                            </>
                        }

            </ul>
        </div>
    )
}
export default Menu;
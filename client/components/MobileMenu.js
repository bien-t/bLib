import React from 'react';
import { NavLink } from 'react-router-dom';
import { createUseStyles } from 'react-jss'
import { useAuth } from './api/api-auth';
import { colors } from '../styles/variables'

const useStyles = createUseStyles({
    mobileNavigation: {
        width: '100%',
        marginBottom: 50,
        position: 'relative',
        '& ul': {
            display: 'flex',
            justifyContent: 'center',
            listStyleType: 'none',
            marginTop: 0,
            flexDirection: 'column',
            width: '100%',
            paddingLeft: 0,

            '& li': {
                display: 'flex',
                margin: {
                    right: 10,
                },
                width: '100%',
                height: 40,
                backgroundColor: colors.mainColor,
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                color:'#fff',
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



function MobileMenu() {
    const auth = useAuth()
    const classes = useStyles();
    const [menu, setMenu] = React.useState({
        show: false
    })

    const handleMenuClick = ()=>{
        setMenu(false)
    }

    return (
        <div  className={classes.mobileNavigation}>
            <ul>
                <li onClick={()=>setMenu({ show: !menu.show })}>Menu</li>
                {menu.show &&
                    <>
                        <li>
                            <NavLink to='/' onClick={handleMenuClick}>Home</NavLink>
                        </li>
                        {
                            !(auth && auth.user) &&
                            <>
                                <li>
                                    <NavLink to='/signup' onClick={handleMenuClick}>Sign up</NavLink>
                                </li>
                                <li>
                                    <NavLink to='/login' onClick={handleMenuClick}>Login</NavLink>
                                </li>
                            </>
                        }
                        {
                            (auth && auth.user) &&
                            <>
                                <li>
                                    <NavLink to='/search' onClick={handleMenuClick}>Search</NavLink>
                                </li>
                                <li>
                                    <NavLink to='/library' onClick={handleMenuClick}>Library</NavLink>
                                </li>
                                <li>
                                    <NavLink to={`/collection/user/${auth.user._id}`} onClick={handleMenuClick}>My collection</NavLink>
                                </li>
                                <li>
                                    <NavLink to='/profile' onClick={handleMenuClick}>Profile</NavLink>
                                </li>
                                <li>
                                    <a onClick={() => {auth.logout(); handleMenuClick()}}>Logout</a>
                                </li>
                            </>
                        }
                    </>
                }

            </ul>
        </div>
    )
}
export default MobileMenu;
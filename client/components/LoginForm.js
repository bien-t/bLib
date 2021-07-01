import React from 'react';
import { createUseStyles } from 'react-jss'
import styles from '../styles/login_signUp_form'

const useStyles = createUseStyles(styles)

function LoginForm(props) {
    const classes = useStyles();
    return (
        <>
            <form className={classes.form} onSubmit={props.handleSubmit}>
                <h3 className={classes.title}>Login</h3>
                <label className={classes.inputContainer}>
                    Email: <input type="email" placeholder="Email" onChange={props.handleValueChange('email')} />
                </label>
                <label className={classes.inputContainer}>
                    Password: <input type="password" placeholder="Password" onChange={props.handleValueChange('password')} />
                </label>
                {props.data.error &&
                    <span className={classes.error}>{props.data.error}</span>
                }
                <button type="submit">Login</button>
            </form>
        </>
    )
}

export default LoginForm;
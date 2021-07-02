import React from 'react';
import { createUseStyles } from 'react-jss'
import styles from '../styles/login_signUp_form'
const useStyles = createUseStyles(styles)

function SignupForm(props) {
    const classes = useStyles();
    return (
        <form className={classes.form} onSubmit={props.handleSubmit}>
            <h3 className={classes.title}>Create a new account</h3>
            <label className={classes.inputContainer}>
                Email:<input type="email" placeholder="Email" onChange={props.handleValueChange('email')} />
            </label>
            <label className={classes.inputContainer}>
                Password:<input type="password" placeholder="Password - between 6 and 20 characters" onChange={props.handleValueChange('password')} />
            </label>
            {props.data.error &&
                <span className={classes.error}>{props.data.error}</span>
            }
            <button type="submit">Register</button>
        </form>
    )
}


export default SignupForm
import React from 'react';
import { createUseStyles } from 'react-jss'
import { useAuth } from './api/api-auth'
import { Redirect } from 'react-router-dom'
import styles from '../styles/login_signUp_form'

const useStyles = createUseStyles(styles)

function Login() {
    const classes = useStyles();
    const auth = useAuth()

    const [formValues, setFormValues] = React.useState({
        email: '',
        password: '',
        error: ''
    })
    const handleValueChange = (value) => (e) => {
        setFormValues({ ...formValues, [value]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const user = {
            email: formValues.email || null,
            password: formValues.password || null
        }
        auth.signin(user).then((data => {
            if (data.error) {
                setFormValues({ ...formValues, error: data.error })
            }
        }))
    }

    if (auth && auth.user) {
        return <Redirect to="/" />;
    }

    return (
        <>
            <form className={classes.form} onSubmit={handleSubmit}>
                <h3 className={classes.title}>Login</h3>
                <label className={classes.inputContainer}>
                    Email: <input type="email" placeholder="Email" onChange={handleValueChange('email')} />
                </label>
                <label className={classes.inputContainer}>
                    Password: <input type="password" placeholder="Password" onChange={handleValueChange('password')} />
                </label>
                {formValues.error &&
                    <span className={classes.error}>{formValues.error}</span>
                }
                <button type="submit">Login</button>
            </form>
        </>
    )
}

export default Login;
import React from 'react';
import apiUser from './api/api-user'
import { useAuth } from './api/api-auth'
import { createUseStyles } from 'react-jss'
import { header, button } from '../styles/mixins'
import {colors} from '../styles/variables'

const useStyles = createUseStyles({
    header: header(),
    profileContainer: {
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto 20px auto',
        width: '100%',
        maxWidth:600,
        minHeight: 200,
        border: `2px solid ${colors.mainColor}`,
        padding: 10,
        color: colors.mainColor,
        '@media (max-width:650px)':{
            width:'90%',
        }
    },
    profileField: {
        display: 'flex',
        marginBottom: 5,
        '& button': {
            marginLeft: 'auto'
        }

    },
    button: button(5),
    passwordButton: {
        marginTop: 'auto'
    },
    modalBackground: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'absolute',
        width: '100%',
        height: '100vh',
        top: 0,
        left: 0,
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        display: 'flex',
        width: 500,
        height: 250,
        border: `2px solid ${colors.mainColor}`,
        position: 'relative',
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'column',
        '& label': {
            textAlign: 'center'
        },
    },
    modalClose: {
        position: 'absolute',
        top: -10,
        right: -10,
    }
})

function Profile() {
    const classes = useStyles()
    const auth = useAuth();
    const [userInfo, setUserInfo] = React.useState(null);

    const [error, setError] = React.useState({
        error: '',
    })

    const [emailFields, setEmailFields] = React.useState({
        show: false,
        email: '',
        emailConfirmation: '',
    })
    const [message, setMessage] = React.useState({
        message: ''
    })
    const [passwordFields, setPasswordFields] = React.useState({
        show: false,
        password: '',
        passwordConfirmation: ''

    })
    const [reload, setReload] = React.useState({
        reload: false
    })

    const handleFieldClick = (name) => () => {
        if (name === 'email') { setEmailFields({ ...emailFields, show: true }) }
        if (name === 'password') { setPasswordFields({ ...passwordFields, show: true }) }

    }
    const emailChange = (name) => (e) => {
        if (name === 'email') { setEmailFields({ ...emailFields, email: e.target.value }) }
        if (name === 'emailConfirmation') { setEmailFields({ ...emailFields, emailConfirmation: e.target.value }) }
    }

    const submitEmailChange = (e) => {
        e.preventDefault()
        const email = {
            email: emailFields.email,
            emailConfirmation: emailFields.emailConfirmation,
        }
        if (emailFields.email === emailFields.emailConfirmation && emailFields.emailConfirmation !== '' && emailFields.email !== '') {

            apiUser.changeEmail(email, { userId: auth.user._id }).then((data) => {
                if (data.error) {
                    setMessage({ message: data.error })
                }
                if (data.message === "Email adress has been updated") {
                    setEmailFields({ email: '', emailConfirmation: '', show: false })
                    setReload({ reload: !reload.reload })
                }
            })
            setMessage({ message: '' })

        } else {
            setMessage({ message: 'Emails are different' })
        }
    }
    const passwordChange = (name) => (e) => {
        if (name === 'password') { setPasswordFields({ ...passwordFields, password: e.target.value }) }
        if (name === 'passwordConfirmation') { setPasswordFields({ ...passwordFields, passwordConfirmation: e.target.value }) }
    }

    const submitPasswordChange = (e) => {
        e.preventDefault()
        const password = {
            password: passwordFields.password,
            passwordConfirmation: passwordFields.passwordConfirmation,
        }
        if (passwordFields.password === passwordFields.passwordConfirmation && passwordFields.passwordConfirmation !== '' && passwordFields.password !== '') {
            apiUser.changePassword(password, { userId: auth.user._id }).then((data) => {
                if (data.error) {
                    setMessage({ message: data.error })
                }
                if (data.message === "Password has been updated") {
                    setPasswordFields({ password: '', passwordConfirmation: '', show: false })
                    setReload({ reload: !reload.reload })
                }
            })
            setMessage({ message: '' })
        } else {
            setMessage({ message: 'Passwords are different' })
        }
    }

    const closeModal = (name) => () => {
        if (name === 'email') { setEmailFields({ email: '', emailConfirmation: '', show: false }) }
        if (name === 'password') { setPasswordFields({ password: '', passwordConfirmation: '', show: false }) }
    }

    React.useEffect(() => {
        const abort = new AbortController()
        const signal = abort.signal;
        apiUser.getUserInfo({
            userId: auth.user._id
        }, signal).then((data => {
            if (data === undefined) {
                return null
            }
            if (data.error) {
                setError({ error: data.error })
            } else {
                setUserInfo(data)
            }
        }))
        return function cleanup() {
            abort.abort()
            setEmailFields({})

        }
    }, [reload.reload])

    React.useEffect(() => {
        if (error.error === 'You are not logged in') {
            auth.logout()
        }
    }, [error.error])

    return (
        <div>
            <h2 className={classes.header}>Profile</h2>
            {userInfo &&
                <div className={classes.profileContainer}>
                    <div className={classes.profileField}>
                        User id: {userInfo._id}
                    </div>
                    <div className={classes.profileField}>
                        Email: {userInfo.email} <br />
                        <button className={classes.button} onClick={handleFieldClick('email')}>Change</button>
                    </div>
                    {emailFields.show &&
                        <>
                            <div className={classes.modalBackground}>
                                <form className={classes.modalContent} onSubmit={submitEmailChange}>
                                    <h3 className={classes.header}>Type your new email adress</h3>
                                    <label>Email: <br />
                                        <input type="email" onChange={emailChange('email')} />
                                    </label>
                                    <label>Confirm your email: <br />
                                        <input type="email" onChange={emailChange('emailConfirmation')} />
                                    </label>
                                    <span style={{ color: "red" }}>
                                        {message.message}

                                    </span>
                                    <button type="button" className={`${classes.modalClose} ${classes.button}`} onClick={closeModal('email')}>X</button>
                                    <button type="submit" className={`${classes.button}`} style={{ marginTop: '10px' }}>Submit</button>
                                </form>
                            </div>
                        </>
                    }
                    {passwordFields.show &&
                        <>
                            <div className={classes.modalBackground}>
                                <form className={classes.modalContent} onSubmit={submitPasswordChange}>
                                    <h3 className={classes.header}>Type your new password</h3>
                                    <label>Password: <br />
                                        <input type="password" onChange={passwordChange('password')} />
                                    </label>
                                    <label>Confirm your password: <br />
                                        <input type="password" onChange={passwordChange('passwordConfirmation')} />
                                    </label>
                                    <span style={{ color: "red" }}>
                                        {message.message}
                                    </span>
                                    <button type="button" className={`${classes.modalClose} ${classes.button}`} onClick={closeModal('password')}>X</button>
                                    <button type="submit" className={`${classes.button}`} style={{ marginTop: '10px' }}>Submit</button>
                                </form>
                            </div>
                        </>
                    }
                    <button className={`${classes.button} ${classes.passwordButton}`} onClick={handleFieldClick('password')}>Change password</button>
                </div>
            }
        </div>
    )
}

export default Profile;
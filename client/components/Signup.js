import React from 'react';
import { useAuth } from './api/api-auth'
import { Redirect } from 'react-router-dom'
import SignupForm from './SignupForm';

function Signup() {
    const auth = useAuth()

    const [formValues, setFormValues] = React.useState({
        email: '',
        password: '',
    })
    
    const [error, setError] = React.useState({
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
        auth.signup(user).then((data => {
            if (data.error) {
                setError({error: data.error })
            }
        }))
    }

    if (auth && auth.user) {
        return <Redirect to="/" />;
    }
    return (
        <SignupForm handleValueChange={handleValueChange} handleSubmit={handleSubmit} data={error} />
    )
}

export default Signup;
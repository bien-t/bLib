import React from 'react';
import { useAuth } from './api/api-auth'
import { Redirect } from 'react-router-dom'
import LoginForm from './LoginForm'


function Login() {
    const auth = useAuth()

    const [formValues, setFormValues] = React.useState({
        email: '',
        password: '',
    })
    const [error,setError] = React.useState({
        error:''
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
                setError({error:data.error})
            }
        }))
    }

    if (auth && auth.user) {
        return <Redirect to="/" />;
    }

    return (
            <LoginForm handleValueChange={handleValueChange} handleSubmit={handleSubmit} data={error}/>
    )
}

export default Login;
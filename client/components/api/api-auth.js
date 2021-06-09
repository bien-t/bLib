import React from 'react'
import login from './api-login'
import createAccount from './api-signup'

const authContext = React.createContext();

export const verify = async () => {
  try {
    let response = await fetch('/api/verification', {
      method: 'GET',
    })
    const { user } = await response.json();
    return user
  }
  catch (err) {
    console.log(err)
  }
}

export function ProvideAuth({ children, value }) {
  let auth = null;
  if (value) {
    auth = useProvideAuth(value);
  } else {
    auth = useProvideAuth(null);
  }
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => {
  return React.useContext(authContext);
}


function useProvideAuth(value) {
  const [user, setUser] = React.useState(value);

  const signin = (user) => {
    return login(user).then(data => {
      if (data._id) {
        setUser(data)
      }
      return data
    })
  }

  const signup = (user) => {
    return createAccount(user).then(data => {
      if (data._id) {
        setUser({ _id: data._id })
      }
      return data
    })
  }

  const logout = () => {
    try {
      fetch('/api/logout', { method: 'DELETE' })
      setUser(null)
    } catch (err) {
      console.log(err)
    }
  }

  return {
    user,
    signin,
    signup,
    logout
  }
}


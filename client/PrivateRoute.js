import { useAuth } from './components/api/api-auth';
import React from 'react';
import { Route, Redirect } from 'react-router-dom'

export function PrivateRoute({ children, ...rest }) {
  let authValue = useAuth();
  return (
    <Route
      {...rest}
      render={() =>
        authValue.user ? (
            children
        ) : (
            <Redirect
              to={{
                pathname: "/login",
              }}
            />
          )
      }
    />
  );
}

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Menu from './components/Menu';
import Signup from './components/Signup';
import MainPage from './components/MainPage'
import Login from './components/Login'
import Profile from './components/Profile'
import { PrivateRoute } from './PrivateRoute'
import Library from './components/Library'
import Book from './components/Book'
import Collection from './components/Collection'
import Author from './components/Author'
import Search from './components/Search'
import MobileMenu from './components/MobileMenu';


function Router() {
  const [media, setMedia] = React.useState({
    matches: window.innerWidth < 650 ? true : false
  })
  React.useEffect(() => {
    let mediaQuery = window.matchMedia('(max-width:650px)')
    mediaQuery.addEventListener('change',setMedia)

    return () => mediaQuery.removeEventListener('change',setMedia);
  }, [])
  return (
    <>
      {media.matches ? <MobileMenu /> : <Menu />}
      <Switch>
        <Route exact path="/">
          <MainPage />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <PrivateRoute path="/profile" exact>
          <Profile />
        </PrivateRoute>
        <PrivateRoute path="/library" >
          <Library />
        </PrivateRoute>
        <PrivateRoute path="/book/:isbn">
          <Book />
        </PrivateRoute>
        <PrivateRoute path="/collection/user/:userId">
          <Collection />
        </PrivateRoute>
        <PrivateRoute path="/author/:authorId">
          <Author />
        </PrivateRoute>
        <PrivateRoute path="/search">
          <Search />
        </PrivateRoute>
        <Route path="*">
          <MainPage />
        </Route>
      </Switch>
    </>
  )
}


export default Router;
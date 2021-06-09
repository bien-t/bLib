import { hot } from 'react-hot-loader'
import React from 'react'
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  '@import': 'url(https://fonts.googleapis.com/css?family=Athiti:400,500,600)',
  '@global': {
    html: {
      boxSizing: 'border-box',
      fontSize: '62.5%'
    },
    '*': {
      boxSizing: 'inherit',

    },
    '*::before': {
      boxSizing: 'inherit'
    },
    '*::after': {
      boxSizing: 'inherit'
    },

    body: {
      fontSize: '1.6rem',
      position: 'relative',
      minWidth: 450,
      fontFamily: `'Athiti', sans-serif`,
      fontWeight: 500,
      margin:0,
    },
  }
})

function App() {
  const styles = useStyles()

  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  )
}


export default hot(module)(App)
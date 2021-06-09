
import React from 'react'
import App from './App'
import ReactDOM from 'react-dom'
import { ProvideAuth,verify } from './components/api/api-auth'


const render = authenticate => {
    ReactDOM.render(
        <ProvideAuth value={authenticate}>
            <App />
        </ProvideAuth>,
        document.getElementById('root'))
}


(async () => render(await (verify())))();
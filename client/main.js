import React from 'react'
import { hydrate } from 'react-dom'
import { ConnectedRouter } from 'connected-react-router';
import configureStore from './configureStore'
import { Provider } from 'react-redux'
import App from './App'

const { store, history } = configureStore(history);

hydrate(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)

import 'babel-polyfill';
import Bluebird from 'bluebird';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import configureStore from '../common/configureStore';
import createEngine from 'redux-storage-engine-localstorage';
import createRoutes from './createRoutes';
import { Provider } from 'react-redux';
import { match, Router, browserHistory } from 'react-router';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';
import IsomorphicRouter from 'isomorphic-relay-router';

const environment = new Relay.Environment();
environment.injectNetworkLayer(new Relay.DefaultNetworkLayer('/graphql'));

const data = window.__PRELOADED__;

window.Promise = Bluebird;
Bluebird.config({ warnings: false });

const store = configureStore({
  createEngine,
  initialState: window.__INITIAL_STATE__,
  platformMiddleware: [routerMiddleware(browserHistory)]
});
const history = syncHistoryWithStore(browserHistory, store);
const routes = createRoutes(store.getState);

match({ routes, history }, (error, redirectLocation, renderProps) => {
  IsomorphicRouter.injectPreparedData(environment, renderProps, data)
    .then(props => {
      ReactDOM.render(
        <Provider store={store}>
          <Router {...props} />
        </Provider>
        , document.getElementById('app')
      );
    });
});

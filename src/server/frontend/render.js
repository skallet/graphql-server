import config from '../config.js';
import configureStore from '../../common/configureStore';
import createRoutes from '../../browser/createRoutes';
import { createMemoryHistory, match, Router } from 'react-router';
import IsomorphicRouter from 'isomorphic-relay-router';
import Helmet from 'react-helmet';
import Html from './Html.react.js';
import serialize from 'serialize-javascript';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Relay from 'react-relay';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';

const getInitialState = () => ({
  config: {
    appName: config.appName,
  }
});

const renderApp = (store, renderProps) => {
  const appHtml = ReactDOMServer.renderToString(
    <Provider store={store}>
      <Router {...renderProps} />
    </Provider>
  );

  return { appHtml, helmet: Helmet.rewind() };
};

const renderScripts = (state, data, headers, hostname, appJsFilename) =>
  `
    <script>
      window.__INITIAL_STATE__ = ${serialize(state)};
      window.__PRELOADED__ = ${serialize(data)};
    </script>
    <script src="${appJsFilename}"></script>
  `;

const renderPage = (store, data, renderedProps, req) => {
  const {
    headers,
    hostname
  } = req;

  const { appHtml, helmet } = renderApp(store, renderedProps);

  const {
    styles: { app: appCssFilename },
    javascript: { app: appJsFilename }
  } = webpackIsomorphicTools.assets();

  const state = store.getState();
  const scriptsHtml = renderScripts(state, data, headers, hostname, appJsFilename);
  if (!config.isProduction) {
    webpackIsomorphicTools.refresh();
  }

  const docHtml = ReactDOMServer.renderToStaticMarkup(
    <Html
      appCssFilename={appCssFilename}
      bodyHtml={`<div id="app">${appHtml}</div>${scriptsHtml}`}
      helmet={helmet}
      isProduction={config.isProduction}
    />
  );

  return `<!DOCTYPE html>${docHtml}`;
};


export default function render(req, res, next) {
  const initialState = getInitialState(req);
  const memoryHistory = createMemoryHistory(req.originalUrl);
  const store = configureStore({
    initialState,
    platformMiddleware: [routerMiddleware(memoryHistory)]
  });
  const history = syncHistoryWithStore(memoryHistory, store);
  const routes = createRoutes(store.getState);
  const location = req.url;
  const networkLayer = new Relay.DefaultNetworkLayer('http://localhost:8000/graphql/', {
    headers: req.headers,
  });

  match({ history, routes, location }, async (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(301, redirectLocation.pathname + redirectLocation.search);
      return;
    }

    if (error) {
      next(error);
      return;
    }

    if (!renderProps) {
      res.end();
      return;
    }

    try {
      IsomorphicRouter.prepareData(renderProps, networkLayer)
        .then(({ data, props }) => {
          const html = renderPage(store, data, props, req);
          const status = props.routes
            .some(route => route.path === '*') ? 404 : 200;

          res.status(status).send(html);
        })
        .catch((e) => {
          next(e);
        });
    } catch (e) {
      next(e);
    }
  });
}

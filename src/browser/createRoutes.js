import React from 'react';
import { IndexRoute, Route } from 'react-router';
import App from './app/Page.react';
import AppQueries from '../common/app/queries.js';
import Home from './home/Page.react';

export default function createRoutes() {
  return (
    <Route component={App} path="/" queries={AppQueries.app}>
      <IndexRoute component={Home} queries={AppQueries.home} prepareParams={() => ({ page: 1 })} />
      <Route component={Home} path="/:page" queries={AppQueries.home} />
    </Route>
  );
}

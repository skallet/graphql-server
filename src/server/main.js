import config from './config';
import express from 'express';
import graphql from './graphql/';
import frontend from './frontend/';
import errorHandler from './lib/errorHandler.js';

const app = express();

app.use('/graphql', graphql);
app.use(frontend);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log('Server started at port %d', config.port);
});

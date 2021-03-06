import express from 'express';
import compression from 'compression';
import render from './render.js';

const app = express();

app.use(compression());

app.use('/assets', express.static('build', { maxAge: '200d' }));

app.get('*', render);

app.on('mount', () => {
  console.log('App is available at %s', app.mountpath);
});

export default app;

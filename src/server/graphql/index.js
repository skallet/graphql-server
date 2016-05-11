import express from 'express';
import session from 'express-session';
import schema from './schema.js';
import graphqlHTTP from 'express-graphql';

const app = express();

// !config.isProduction && app.use((req, res, next) => {
//  if (req.method === 'POST' && req.body && req.body.query) {
//    const prettyQuery = print(parse(req.body.query));
//    console.log(prettyQuery);
//  }

//  next();
// })

app.use(session({
  secret: 'session-naive-secret',
  cookie: { maxAge: 60000 },
}));

app.use('/', graphqlHTTP(req => ({
  schema,
  rootValue: { session: req.session },
  pretty: true,
  graphiql: true,
})));

app.on('mount', () => {
  console.log('GraphQL endpoint mounted at %s', app.mountpath);
});

export default app;

import nconf from 'nconf';
import packg from '../../package.json';

const appName = packg.name;
const appVersion = packg.version;
const isProduction = process.env.NODE_ENV === 'production';

nconf.defaults({
  appName,
  appVersion,
  flickerKey: 'FLICKERKEY',
  isProduction,
  port: process.env.PORT || 8000,
  graphql: '/graphql',
  mongoDb: 'mongodb://localhost/graphql',
});

export default nconf.get();

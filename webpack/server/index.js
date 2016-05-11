if (process.env.NODE_ENV === 'production')
  throw new Error('Webpack server is only for development.');

require('babel-register');
require('./main');

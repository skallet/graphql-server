import appReducer from './app/reducer';
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';

const injectMiddleware = deps => ({ dispatch, getState }) => next => action =>
  next(typeof action === 'function'
    ? action({ ...deps, dispatch, getState })
    : action
  );

export default function configureStore(options) {
  const {
    createEngine,
    initialState,
  } = options;

  const engineKey = `redux-storage:${initialState.config.appName}`;
  const engine = createEngine && createEngine(engineKey);

  const middleware = [
    injectMiddleware({
      engine,
      now: () => Date.now(),
    }),
    promiseMiddleware({
      promiseTypeSuffixes: ['START', 'SUCCESS', 'ERROR']
    })
  ];

  const createStoreWithMiddleware = applyMiddleware(...middleware);

  const store = createStoreWithMiddleware(createStore)(
    // resetOnLogout(appReducer),
    appReducer,
    initialState
  );

  // Enable hot reload where available.
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers.
    module.hot.accept('./app/reducer', () => {
      const nextAppReducer = require('./app/reducer');
      // store.replaceReducer(resetOnLogout(nextAppReducer));
      store.replaceReducer(nextAppReducer);
    });
  }

  return store;
}

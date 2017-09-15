import { createStore, applyMiddleware, compose } from 'redux';
import  reduxImmutableStateInvariant  from 'redux-immutable-state-invariant';
import createSagaMiddleware, { END } from 'redux-saga'
import rootReducer from '../reducers';
import rootSaga from '../sagas';
import  thunk  from 'redux-thunk';

//  //Returns the store instance
// // It can  also take initialState argument when provided
// const configureStore = (initialState) => {
//   const sagaMiddleware = createSagaMiddleware();
//   return {
//     ...createStore(rootReducer,
//        initialState,
//       applyMiddleware(sagaMiddleware())),
//     runSaga: sagaMiddleware.run(rootSaga)
//   };
// };
//
//
//
// // export default  function configureStore(initialState){
// //   return createStore(
// //     rootReducer,
// //     initialState,
// //     applyMiddleware(sagaMiddleware)
// //   )
// // };
//
// export default configureStore;
//


export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk, reduxImmutableStateInvariant()),
      /**
       * Conditionally add the Redux DevTools extension enhancer
       * if it is installed.
       */
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )
  return store
}

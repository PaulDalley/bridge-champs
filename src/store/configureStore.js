// import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import articlesReducer from "./reducers/articlesReducer";
import quizzesReducer from "./reducers/quizzesReducer";
import authReducer from "./reducers/authReducer";
import userReducer from "./reducers/usersReducer";
import filtersReducer from "./reducers/filtersReducer";
// import thunk from "redux-thunk";
import thunkMiddleware from "redux-thunk";
// import createSagaMiddleware from 'redux-saga';
import { initSagas } from "../sagas/initSagas";
import { composeWithDevTools } from "redux-devtools-extension";

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default () => {
  // const sagaMiddleware = createSagaMiddleware();
  const middlewares = [thunkMiddleware]; // [thunk, sagaMiddleware],
  //   const middlewareEnhancer = applyMiddleware(thunkMiddleware);
  //   const composedEnhancers = compose(middlewareEnhancer);
  const composables = [applyMiddleware(...middlewares)];
  const enhancer = compose(...composables);

  const reducer = combineReducers({
    articles: articlesReducer,
    auth: authReducer,
    quizzes: quizzesReducer,
    user: userReducer,
    filters: filtersReducer,
    // article: articleReducer,
  });

  const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(...middlewares))
  );

  //   const store = createStore(
  // reducer,
  // applyMiddleware(...middlewares);
  //   );
  return store;
};

/* 
    reducer,
    // undefined,
    enhancer
    // applyMiddleware(middlewares),
    // enhancer,
    //applyMiddleware(...middlewares)
    // composeEnhancers(applyMiddleware(thunk))
    // applyMiddleware(thunk)
    */

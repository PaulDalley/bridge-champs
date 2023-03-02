// import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import articlesReducer from './reducers/articlesReducer';
import quizzesReducer from './reducers/quizzesReducer';
import authReducer from './reducers/authReducer';
import userReducer from './reducers/usersReducer';
import filtersReducer from './reducers/filtersReducer';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { initSagas } from '../sagas/initSagas';

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default () => {
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware, thunk];
    const composables = [applyMiddleware(...middlewares)];
    const enhancer = compose(
        ...composables
    );

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
            enhancer,
            //applyMiddleware(...middlewares)
        // composeEnhancers(applyMiddleware(thunk))
        // applyMiddleware(thunk)
    );
    return store;
};

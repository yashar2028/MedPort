import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './authSlice';
import providersReducer from './providersSlice';
import bookingsReducer from './bookingsSlice';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  providers: providersReducer,
  bookings: bookingsReducer
});

// Create store with middleware
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
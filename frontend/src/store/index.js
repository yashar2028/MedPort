import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import providerReducer from './providerSlice';
import bookingReducer from './bookingSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    providers: providerReducer,
    bookings: bookingReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;

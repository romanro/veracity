import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userslice';
import { argumentsReducer } from './argumentsSlice';
import { toastReducer } from './toastSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    arguments: argumentsReducer,
    toast: toastReducer,
  },
});


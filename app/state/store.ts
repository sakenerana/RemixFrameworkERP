import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../state/counter/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer
  }, // We'll add reducers here later
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
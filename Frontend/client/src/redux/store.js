import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from './wishlistSlice';


export const store = configureStore({
  reducer:{
    wishlist: wishlistReducer,
  },
});
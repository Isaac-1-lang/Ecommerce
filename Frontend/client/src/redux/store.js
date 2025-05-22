import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from './wishlistSlice';


const store = configureStore({
  reducer:{
    wishlist: wishlistReducer,
  },
});

export default store;
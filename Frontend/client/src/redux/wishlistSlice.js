import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name:'wishlist',
  initialState: {
    favourites:[],
  },
  reducers: {
    addToFavourites:(state,action)=> {
      if(!state.favourites.includes(action.payload)) {
        state.favourites.push(action.payload);
      }
    },
    removeFromFavourites: (state, action) => {
      state.favourites = state.favourites.filter(id !== action.payload);
    },
  },
});


export const { addToFavourites, removeFromFavourites } = wishlistSlice.actions;
export default wishlistSlice.reducer;
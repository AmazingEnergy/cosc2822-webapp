import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./slices/cart.slice";

export default combineReducers({
    "cart": cartReducer,
})
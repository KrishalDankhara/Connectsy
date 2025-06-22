import { configureStore } from "@reduxjs/toolkit";
import { useReducer } from "react";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducers from "./connectionSlice";
import requestReducers from "./requestSlice";
import requestedReducers from "./requestedSlice";
import ignoredReducers from "./ignoredSlice";
const appStore=configureStore({
    reducer:{
        user:userReducer,
        feed:feedReducer,
        connections:connectionReducers,
        requests:requestReducers,
        requested:requestedReducers,
        ignored:ignoredReducers,
    },
})

export default appStore
import { createSlice } from "@reduxjs/toolkit";


const feedSLice=createSlice({
    name:"feed",
    initialState:null,
    reducers:{
        addFeed:(state,action)=>{
            return action.payload;
        },
        removeUserFromFeed:(state,action)=>{
            const newArray=state.filter(r=>r._id!=action.payload);
            return newArray;
        },
        clearFeed: () => null,
    }
})

export const {addFeed,removeUserFromFeed,clearFeed}=feedSLice.actions;

export default feedSLice.reducer;

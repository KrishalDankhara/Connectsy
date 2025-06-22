import { createSlice } from "@reduxjs/toolkit";

const ignoredSlice=createSlice({
    name:"ignored",
    initialState:[],
    reducers:{
        addIgnored:(state,action)=>{
            return action.payload
        },
        removeUser:(state,action)=>{
            return state.filter((user) => user._id !== action.payload);
        }
        
    }
})
export const {addIgnored,removeUser}=ignoredSlice.actions;
export default ignoredSlice.reducer;
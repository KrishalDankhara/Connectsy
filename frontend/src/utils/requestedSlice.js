import { createSlice } from "@reduxjs/toolkit";

const requestedSlice=createSlice({
    name:"requested",
    initialState:[],
    reducers:{
        addRequested:(state,action)=>{
            return action.payload
        },
        removeRequested:(state,action)=>{
            const newArray=state.filter(r=>r._id!=action.payload)
            return newArray
        }
    }
})

export const {addRequested,removeRequested}=requestedSlice.actions;
export default requestedSlice.reducer;

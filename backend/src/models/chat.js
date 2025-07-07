const mongoose=require("mongoose");

const messageSchema=new mongoose.Schema({
    senderId:{   // References the user who sent the message (linked to the backend/src/models/user.js).
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    text:{
        type:String,
        required:true,
    }
},{timestamps:true})  // timestamps: Automatically adds createdAt and updatedAt fields to each message.

const chatSchema=new mongoose.Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }],
    messages:[messageSchema]
})

const Chat=mongoose.model("Chat",chatSchema);

module.exports=Chat

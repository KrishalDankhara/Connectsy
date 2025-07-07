const mongoose = require("mongoose");

const connectionrequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "accepted", "rejected", "interested"],
        message: `{VALUE} is not valid status`,
      },
    },
  },
  {
    timestamps: true,
  }
);


connectionrequestSchema.index({fromUserId:1,toUserId:1});

connectionrequestSchema.pre("save", function(next){
    const connectionRequest=this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send request to yourself");
    }
    next();
})
const connectionRequestModel = new mongoose.model(
  "ConnectionRequest",    // Registers the schema as the ConnectionRequest model for use throughout the backend.
  connectionrequestSchema
);
module.exports = connectionRequestModel;

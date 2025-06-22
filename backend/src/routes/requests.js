const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const ALLOWED_STATUS_TYPES = ["ignored", "interested"];
      if (!ALLOWED_STATUS_TYPES.includes(status)) {
        res.status(400).json({
          message: "Invalid status type : " + status,
        });
      }
      const userId = await User.findOne({ _id: toUserId });
      if (!userId) {
        return res.status(400).send("User not found");
      }
      const isExisting = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (isExisting) {
        return res.status(400).json({
          message: "Connection Request already exists",
        });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: status,
        data,
      });
    } catch (err) {
      res.status(400).send("Error: " + err);
    }
  }
);



requestRouter.post("/request/review/:status/:requestId",userAuth,async (req,res)=>{
    const {status,requestId}=req.params;
    const loggedInUser=req.user;
    const allowedStatus=["accepted","rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({message:"Status is not valid"});
    }
    const connectrequest=await ConnectionRequest.findOne({
      _id:requestId,
      toUserId:loggedInUser._id,
      status:"interested"
    })
    if(!connectrequest){
      return res.status(400).json({
        message:"Connection request not sent"
      });
    }
    connectrequest.status=status;
    await connectrequest.save();
    res.send("Connection request "+status);

})

requestRouter.post("/request/ignored/interested/:toUserId",userAuth,async (req,res)=>{
  
    const loggedInUser=req.user._id;
    const toUserId=req.params.toUserId;
    const connectionRequest=await ConnectionRequest.findOne({
      fromUserId:loggedInUser._id,
      toUserId:toUserId,
      status:"ignored"
    })
    if(!connectionRequest){
      return res.status(400).json({
        message:"Connection request not sent"
      });
    }
    console.log("Connection request",connectionRequest);
    connectionRequest.status="interested";
    await connectionRequest.save();
    res.send("Connection request "+connectionRequest.status);
})
module.exports = requestRouter;

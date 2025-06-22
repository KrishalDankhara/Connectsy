const express=require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter=express.Router();
const razorpayInstance=require("../utils/razorpay");
const Payment=require("../models/payment")
const {membershipAmount}=require("../utils/constants")
const User =require("../models/user")
const crypto = require("crypto");
paymentRouter.post("/payment/create",userAuth,async (req,res)=>{
    
    try{
        
        const {membershipType}=req.body
        const {firstName,lastName,emailId}=req.user;
        const order=await razorpayInstance.orders.create({
            amount:membershipAmount[membershipType]*100,
            currency:"INR",
            receipt:"receipt#1",
            notes:{
                firstName,
                lastName,
                emailId,
                membership:membershipType
            }
        })
        const payment=new Payment({
            userId:req.user._id,
            orderId:order.id,
            status:order.status,
            amount:order.amount,
            currency:order.currency,
            receipt:order.receipt,
            notes:order.notes
        })
        
        const savedPayment=await payment.save();
        res.json({...savedPayment.toJSON(),keyId:process.env.RAZORPAY_KEY_ID})

    }catch(err){
        console.error("Payment error:", err);
        res.status(400).json("Erroor: "+err.message);
    }
})

paymentRouter.post("/payment/verify", userAuth, async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const updatedPayment = await Payment.findOneAndUpdate(
      { orderId },
      {
        paymentId,
        status: "captured",
      },
      { new: true }
    );
    await User.findByIdAndUpdate(req.user._id, { isVerified: true });
    if (!updatedPayment) {
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }

    res.json({ success: true, payment: updatedPayment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports=paymentRouter;

const express=require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter=express.Router();
const {validateUserEditData,validatePass}=require("../utils/validation")
const User = require("../models/user");
const bcrypt=require("bcrypt");


profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
      const user = req.user;
      res.send(user);
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  });


  profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validateUserEditData(req)){
            throw new Error("Invalid request you mf");
        }
        const loggedUser=req.user;

        Object.keys(req.body).forEach((k)=>loggedUser[k]=req.body[k]);
        await loggedUser.save();
        res.send(loggedUser);

    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  });

  profileRouter.patch("/profile/edit/password",userAuth,async (req,res)=>{
    try{
        const user=req.user;
        const{passwordExisting}=req.body;
        const flag=await bcrypt.compare(passwordExisting, user.password);
        if(!flag){
            throw new Error("Password is not correct");
        }
        const {newPassword}=req.body;
        if(!validatePass(req)){
            throw new Error("Your new password is not strong");
        };
        const hashedPass=await bcrypt.hash(newPassword,10);
        user.password=hashedPass;
        await user.save();
        res.send("Password changed!!")
    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
  })
module.exports=profileRouter;
import { MongoNetworkTimeoutError } from "mongodb";
import bcrypt from "bcryptjs"
import User from "../models/user.model.js";

export const signup=async (req,res)=>{
    try {
        const {fullname,username,password,confirmpassword,gender}=req.body;
    if(password!==confirmpassword){
        return res.status(400).json({error:"Password don't match"});
    }
    const user =await User.findOne({username})
    if(user){
        return res.status(400).json({error:"Username already exists"});
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    const maleProfilePic=`https://avatar.iran.liara.run/public/boy?username=${username}`
    const femaleProfilePic=`https://avatar.iran.liara.run/public/girl?username=${username}`
    
    const newUser= new User({
        fullname,
        username,
        password:hashedPassword,
        gender,
        profilePic: gender=="male" ? maleProfilePic :femaleProfilePic
    })
    await newUser.save();
    res.status(201).json({
        _id:newUser._id,
        fullname:newUser.fullname,
        username:newUser.username,
        profilePic:newUser.profilePic
    })
    } catch (error) {
        console.log("Error in signup controller",error.message);
        res.status(500).json({
            error:"Internal errror"
        })
    }

    
}
export const login=(req,res)=>{
    console.log("login user");
}
export const logout=(req,res)=>{
    console.log("logout user");
}
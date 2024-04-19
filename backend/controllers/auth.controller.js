import { MongoNetworkTimeoutError } from "mongodb";
import bcrypt from "bcryptjs"
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

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

    if(newUser){
        generateToken(newUser._id,res);
        await newUser.save();
        res.status(201).json({
            _id:newUser._id,
            fullname:newUser.fullname,
            username:newUser.username,
            profilePic:newUser.profilePic
        })
    }else{
       return res.json({error:"Invalid user data"});
    }
   } catch (error) {
        console.log("Error in signup controller",error.message);
        res.status(500).json({
            error:"Internal errror"
        })
    }
    
}

export const login=async(req,res)=>{
    try {
        const {username,password}=req.body;
        const user=await User.findOne({username});
        const iscorrectPassword=await bcrypt.compare(password,user?.password ||"")

        if(!user || !iscorrectPassword){
            return res.json({error:"Invalid username or password"});
        }

        generateToken(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            username:user.username,
            profilePic:user.profilePic
        })


    } catch (error) {
        console.log("Error in login controller",error.message);
        res.status(500).json({
            error:"Internal errror"
        })
    }
}

export const logout=(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller",error.message);
        res.status(500).json({
            error:"Internal errror"
        })
    }
}
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { upload } from "../middleware/multer.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { json, response } from "express";

const registerUser = asyncHandler( async (req,res)=>{
    // get user details from frontend
    // validation  -not empty
    // check if user already exist  check by(username,email)
    //check for image ,  avatar
    // upload them to cloudinary , avatar
    // create user object ,create entry in db
    // remove password and refreshToken field from response
    // check for user creation
    // return res

    // get user details from frontend
    const{fullName, email, username , password}=req.body
    console.log("email : ",email);

    //Validation
    //if(fullName==""){
    //    throw new ApiError(400,"fullname is required")
    //    }
    //ye aik field check krta hai like full name passoword therfore we use
    if(
        [fullName,username,password,email].some((field)=>field?.trim() ==="" ))
        {
            throw new ApiError(400,"all fields are required ")
        }
    
    //check if user allready exist
    const existedUser=await User.findOne({
        $or:[{username},{email}]  
    })
    if(existedUser){
        throw new ApiError(409,"user with this email already exist")
    }

    console.log(req.body);
    //check for image 
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImagePath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar file is required")
    }
    //upload it to cloudinary
    const avatar =await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImagePath)

    //check picture upload or not
    if (!avatar){
        throw new ApiError(400,"avatar file is required")
    }
    //create user object
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage:coverImage.url || "" , //if this not exist pass empty it not compolsiry
        email,
        password,
        username:username.toLowerCase()
    })
     
    //remove password and refreshtoken
    const CreatedUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    //check user created or not
    if(!CreatedUser){
        throw new ApiError(500,"something went wrong while registering the user")
    }
    //return API Response
    return res.status(201).json(
        new ApiResponse(200,CreatedUser,"User register Successfully")
    )
})

export {registerUser}
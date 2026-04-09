import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { upload } from "../middleware/multer.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccesstoken()
        const refreshToken = user.generateRefreshtoken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken, refreshToken}
    }
   
    catch (error) {
       throw new ApiError(500,"something went wrong while generating access adn refresh token") 
    }

    
}

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

const loginUser = asyncHandler(async(req,res) => {
    //step to login user
    // req boby se  data lo
    // get username or email
    // find the user
    // password check
    // access & refresh token
    // send cookie

    //take data from user
    const {email,username,password} = req.body
    console.log("email : ",email)

    // username or email
    if(!(username || email)){
        throw new ApiError(400,"username or email is required")
    }

    // find user
    const user = await User.findOne({
        $or:[{username},{email}]
    })

    // if user not found
    if (!user){
        throw new ApiError(404,"userr not exist")
    }

    // check password
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid){
        throw new ApiError(401,"invalid User Credential")
    }

    // Accress & Refresh Token
    // create separate method in top lines 
    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)
    const logedInUser = await User.findById(user._id).select("-password -refreshToken")

    //send cookies 
    const options={
        httpOnly : true,
        secure : true
    }
    // ye cookie sirf server se modified hoga fronted se nahi hoga

    return res.status(200).cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options).json(
        new ApiResponse(200,{
            user:logedInUser,accessToken,
            refreshToken,
        },
    "user LogedIn Successfully !!!")
    )
})

// 
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        { new: true }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User LogOut Successfully"))
})

export {registerUser, loginUser, logoutUser}



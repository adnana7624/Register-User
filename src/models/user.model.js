import mongoose ,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email :{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        index:true
    },
    avatar:{
        type:String, //cloudnary URL
        required:true
    },
    coverImage:{
        type:String,//cloudnary URL
    },
    watchHistory:[{
        type:Schema.Types.ObjectId,
        ref:"video"
    }],
    password:{
        type:String,
        required:[true,"password is required"]
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})

// pre is a hook and use when we want to execute a function or some code before when save it

// userSchema.pre("save", async function(next){
//     this.password=bcrypt.hash(this.password,10)
//     next()
// })

/*
    in this condition if a user change avatar or another field and save it will encrypt password
    everytime and it will change ,when change any file therfore if condition is user to execute 
    only first time password created or when password change by user
*/

//one way 
// userSchema.pre("save"async function(nect) {
    
// if (this.isModified("password") )
//     {
//     this.password=bcrypt.hash(this.password,10)
// }
// })
//another way use ! not 
// userSchema.pre("save", async function(next) {
    
//     if (! this.isModified("password") ) return next();
    
//     this.password = await bcrypt.hash(this.password,10)
//     next()
    
// })

userSchema.pre("save", async function (next) {
    // if password is NOT modified → skip hashing
    if (!this.isModified("password")) {
        return ;
    }
    // hash password
    this.password = await bcrypt.hash(this.password, 10);
    
});

//check Password is enter by user is correct or not
userSchema.methods.isPasswordCorrect=async function (password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccesstoken =function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY 
    }
    )
}
userSchema.methods.generateRefreshtoken=function(){
    return jwt.sign({
        _id:this._id
    },
        process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}


export const User = mongoose.model("User",userSchema)
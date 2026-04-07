import {v2 as cloudnary} from "cloudinary"
import fs from "fs"
cloudnary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});
const uploadOnCloudinary=async(localFilePath)=>{
    try {
        if(!localFilePath) return null
        //upload file to cloudiany
        const response=await cloudnary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file upload successful
        //console.log("file is upload on cloudinary",response.url);

        //donot show image in local storage 
        fs.unlinkSync(localFilePath);
        return response
    }
    catch (error) {
        fs.unlinkSync(localFilePath)
        //remove localy save temporay file as upload operaton got failed
        return null;
    }
}
export {uploadOnCloudinary}
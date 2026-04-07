import {Router} from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router()
//router & controller declear kiya ab export krnga aur app.js mai import kro b/c index.js ko 
//clear rakna hai code divide krke
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]
    ),
    registerUser)

export default router

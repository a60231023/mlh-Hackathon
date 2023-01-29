import User from "../models/userSchema.js"
import JWT from 'jsonwebtoken'
import asyncHandler from '../services/asyncHandler.js'
import CustomError from '../utils/customError,js'
import config from "../config/index.js"

export const isLoggedIn = asyncHandler(async (req, res,mext) => {
    
    let token;
    // token can come from cookies or from Bearer

    if(req.cookies.token ||req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.cookies.token || req.headers.authorization.split(" ")[1];
    }
    if(!token){
        throw new CustomError('Not authorized to access this route ', 401);
    }
    
    try {
        const decodedJwtPayload = JWT.verify(token, config.JWT_SECRET);

        //while making the payload we used _id and role and we are using to find the user.

        // after comma you are giving what is required syntax is a bit odd

        req.user = await User.findById(decodedJwtPayload._id, "name email role");
        next();
    } catch (err) {
        throw new CustomError('Not authorized to access this route ', 401);
    }
});
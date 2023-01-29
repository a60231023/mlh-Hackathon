import User from '../models/userSchema.js'
import asyncHandler from '../services/asyncHandler.js'
import CustomError from '../utils/customError.js'
import mailHelper from '../utils/mailHelper.js';

//3days expiry
 
export const cookieOptions = {
    expires: new Date(Date.now() + 3*24*60*60*1000),
    httpOnly: true,
}

/* 

@SIGNUP
@route http://localhost:4000/api/auth/signup
@description User signup controller for creating  a new user
@parameters name, email, password
@return User Objects

*/

export const signup = asyncHandler(async (req, res) =>{
    const {name, email, password } = req.body;
    if(!name || !email || !password){
        throw new CustomError('Please fill all fields', 400)
    }

    //check if user exists 
    const existingUser = await User.findOne({email});

    if(existingUser){
        throw new CustomError('User already exists', 400);
    }
    const user = await User.create({
        name, email, password
    });
    
    // password encryption done on backend
    // The function which we added to the schema is available to the object instance

    const token = user.getJwtToken()
    console.log(user);

    //first time while creating the password is returned -- next time while querying it will not get as select is fale

    user.password = undefined;
    res.cookie("token", token, cookieOptions)
    res.status(200).json({
        success: true,
        token,
        user
    });

});

/* 

@Login or SignIn
@route http://localhost:4000/api/auth/signIn
@description User signin controller for signing the user in
@parameters email, password
@return User Objects
*/

export const login = asyncHandler( async (req, res) => {
    const {email, password } = req.body;
    if(!email || !password){
        throw new CustomError('Please fill all the fields', 400);
    }
    
    //you have to compare the password but select is false so you do .select + which will override the false

    const user = User.findOne({email}).select("+password");

    if(!user){
        throw new CustomError('Invalid credentials', 400);
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(isPasswordMatched){
        const token = user.getJwtToken();
        user.password = undefined;
        res.cookei("token", token, cookieOptions)
        return res.status(200).json({
            success: true,
            token,
            user
        })
    }
    throw new CustomError('Invalid credentials ', 400);
});

/* 

@Logout
@route http://localhost:4000/api/auth/logout
@description user logging out
@parameters 
@return success message

*/


export const logout = asyncHandler(async (req, res) => {
    // res.clearCookie();
    
    res.cookie("token", null, {
        expires : new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: "You have logged out"
    })

});

/* 

@forgot passwrord
@route http://localhost:4000/api/auth/password/forgot
@description user will submit and we will generate the token
@parameters  email
@return success message - emailsent

*/

export const forgotPassword = asyncHandler( async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email})
    if(!user){
        throw new CustomError('User not found', 404)
    }
    const resetToken = user.generateForgotPasswordToken();
    
    //every time you do save, the database will check for each validation so you don't want to do that

    await user.save({validateBeforeSave: false});

    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/password/reset${resetToken}`
    const text = `Your password reset url is \n]n ${resetUrl}\n\n`

    try {
        await mailHelper({
            email: user.email,
            subject: "Password reset email",
            text: text
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user..email}`
        })
    } catch (error) {
        //roll-back as message not sent so forgot password token which was saved in the db has to be changed back

        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        await user.save({validateBeforeSave: false});

        throw new CustomError(err.message || 'Email sent failure', 500);

    }
})
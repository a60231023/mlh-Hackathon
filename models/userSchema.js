import mongoose from 'mongoose';
import AuthRoles from '../utils/authRoles';
import bcrypt from  "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";
import config from "../config/index"
// I have used mongodb hooks as i need to encrypt the password before saving them into the database, it works like a middleware 

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required : [true, 'Name is required'],
            maxLength : [50, 'Name must be less than 50']
        },
        email : {
            type: String,
            required : [true, 'Email is required'],
            unique : [true, 'Email already taken, please try another one']
        },
        password : {
            type : String,
            required : [true, 'Password is required'],
            minLength : [8, 'Password must be at least 8 characters'],
            select: false
        },
        role : {
            type: String,
            enum : Object.values(AuthRoles),
            default : AuthRoles.USER
        },
        forgotPasswordToken : String,
        forgotPasswordExpiry : Date,
    },
    {
        // will add created and updated fields in my schema
      timestamps : true  
    }
);

//  encrpting the password by using middleware. this pre will make it run everytime we use save method to save things in database-- kind of like eventlistener
userSchema.pre("save", async function(next){
    //checking if modification not done with respect to password then don't need to encrpt the pass
    if(!(this.isModified("password"))) return next()
    this.password = await bcrypt.hash(this.password, 10);
    next()
});

// now adding more functionality to the schema -- kind of like prototype
userSchema.method = {
    // comparing password method
    comparePassword : async function(enteredPassword){
        return await bcrypt.compare(enteredPassword, this.password)
    },

    // generating JWT token for authorization
    getJwtToken : function(){
        return JWT.sign(
            {
                _id: this._id,
                role: this.role
            },
            config.JWT_SECRET,
            {
                expiresIn : config.JWT_EXPIRY
            }
        )
    },

    // generating unique string token for forgot password

    generateForgotPasswordToken : function(){
        //unique string
        const forgotToken = crypto.randomBytes(20).toString('hex');
        
        //save to database by encpryting it
        this.forgotPasswordToken = crypto.createHash("sha256").update(forgotToken).digest("hex");

        //expires in saving to database (20mins)
        this.forgotPasswordExpiry = Data.now() + 20 * 60 * 1000;

        return forgotToken;
    }

}
export default mongoose.model('User', userSchema);

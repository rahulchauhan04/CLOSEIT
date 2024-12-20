import UserModel from "../models/user.model.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import sendEmail from "./sendEmail.js";
import bcryptjs from 'bcryptjs';


//Controller to handle user registration
export async function registerUserController(request, response) {
     try {
          const { name, email, password } = request.body;

          //frontend validation
          if (!name || !email || !password) {
               return response.status(400).json({
                    message : "Provide name, email, password",
                    error : true,
                    success : false
               })
          }

          //database validation
          const user = await UserModel.findOne({ email });

          if( user ) {
               return response.status(400).json({
                    message : "Already Registered Email",
                    error : true,
                    success : false
               })
          }

          //password encryption
          const salt = await bcryptjs.genSalt(10);
          const hashPassword = await bcryptjs.hash(password, salt);

          const payload = {
               name,
               email,
               password  : hashPassword
          }

          const newUser = new UserModel(payload);
          const save = await newUser.save();

          //send email to verify email
          const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`;

          const verifyEmail = await sendEmail({
               sendTo : email,
               subject : "Verify Email from Binkeyit",
               html : verifyEmailTemplate({
                    name,
                    url : verifyEmailUrl
               })
          })

          return response.json({
               message : "User Registered Successfully",
               error : false,
               success : true,
               data : save
          })

     } catch (error) {
          return response.status(500).json({
               message : error.message || error,
               error : true,
               success : false
          })
     }
}

//Controller to handle user email verification
export async function verifyEmailController(request, response) {
     try {
          //frontend validation
          const { code } = request.body;

          //database validation
          const user = await UserModel.findOne({ _id : code });

          if (!user) {
               return response.status(400).json({
                    message : "Invalid Code",
                    error : true,
                    success : false
               })
          }

          const updateUser = await UserModel.updateOne({ _id : code }, { verify_email : true });

          return response.json({
               message : "Verify Email Done",
               error : false,
               success : true,
          })

     } catch (error) {
          return response.status(500).json({
               message : error.message || error,
               error : true,
               success : false
          })
     }
} 

//Controller to handle user login
export async function loginUserController(request, response) {
     try {
          //frontend validation
          const { email, password } = request.body;

          if (!email || !password)  {
               return response.status(400).json({
                    message : "Provide email, password",
                    error: true,
                    success: false
               })
          }

          //database validation
          const user = await UserModel.findOne({ email });

          if (!user) {
               return response.status(400).json({
                    message : "User Not Registered",
                    error : true,
                    success : false
               })
          }

          //check user status
          if (user.status !== "Active") {
               return response.status(400).json({
                    message : "Contact to Admin",
                    error : true,
                    success : false
               })
          }
          
          //password check & compare
          const checkPassword = await bcryptjs.compare(password, user.password);

          if (!checkPassword) {
               return response.status(400).json({
                    message : "Check your Password",
                    error : true,
                    success : false
               })
          }

          //generate access & refresh token
          const accessToken = await generatedAccessToken( user._id );
          const refreshToken = await generatedRefreshToken( user._id );

          //set cookie
          const cookiesOption = {
               httpOnly : true,
               secure : true,
               sameSite : "None"
          }

          response.cookie("accessToken",accessToken,cookiesOption);
          response.cookie("refreshToken",refreshToken,cookiesOption);

          return response.json({
               message : "Login Successfully",
               error : false,
               success : true,
               data : {
                    accessToken,
                    refreshToken
               }
          })

     } catch (error) {
          return response.status(500).json({
               message : error.message || error,
               error : true,
               success : false
          })
     }
} 

//Controller to handle user logout
export async function logoutControoller(request, response ) {
     try {
          //get user id from middleware
          const userid = request.userId

          //update refresh token
          const cookiesOption = {
               httpOnly : true,
               secure : true,
               sameSite : "None"
          }

          response.clearCookie("accessToken", cookiesOption)
          response.clearCookie("refreshToken", cookiesOption)

          //remove refresh token from database
          const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{ refresh_token : ""})

          return response.json({
               message : "Logout Successfully",
               error : false,
               success : true
          })
     } catch (error) {
          return response.status(500).json({
               message : error.message || error,
               error : true,
               success : false
          })
     }
}
import UserModel from "../models/user.model.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import sendEmail from "./sendEmail.js";
import bcryptjs from 'bcryptjs';


//Controller to handle user registration
export async function registerUserController(request, response) {
     try {
          const { name, email, password } = request.body;

          if (!name || !email || !password) {
               return response.status(400).json({
                    message : "Provide name, email, password",
                    error : true,
                    success : false
               })
          }

          const user = await UserModel.findOne({ email });

          if( user ) {
               return response.status(400).json({
                    message : "Already Registered Email",
                    error : true,
                    success : false
               })
          }

          const salt = await bcryptjs.genSalt(10);
          const hashPassword = await bcryptjs.hash(password, salt);

          const payload = {
               name,
               email,
               password  : hashPassword
          }

          const newUser = new UserModel(payload);
          const save = await newUser.save();

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
          const { code } = request.body;

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
          const { email, password } = request.body;

          const user = await UserModel.findOne({ email });

          if (!user) {
               return response.status(400).json({
                    message : "User Not Registered",
                    error : true,
                    success : false
               })
          }

          if (user.status !== "Active") {
               return response.status(400).json({
                    message : "Contact to Admin",
                    error : true,
                    success : false
               })
          }
          
          const checkPassword = await bcryptjs.compare(password, user.password);

          if (!checkPassword) {
               return response.status(400).json({
                    message : "Check your Password",
                    error : true,
                    success : false
               })
          }

     } catch (error) {
          return response.status(500).json({
               message : error.message || error,
               error : true,
               success : false
          })
     }
} 

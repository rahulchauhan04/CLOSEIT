import UserModel from "../models/user.model.js";
import forgotPasswordTemplate from "../utils/forgotPasswordtemplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedOtp from "../utils/generatedOtp.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import sendEmail from "./sendEmail.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';


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

          const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
               last_login_date : new Date(),
          })

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

//Upload User Avatar
export async function uploadAvatar( request, response ) {
     try {

          const userId = request.userId; //auth middleware
          const image = request.file //multer middleware

          //upload image to cloudinary
          const upload = await uploadImageCloudinary(image)

          //update user avatar
          const updateUser = await UserModel.findByIdAndUpdate(userId, {
               avatar : upload.url
          })

          return response.json({
               message : "Upload profile",
               data : {
                    _id : userId,
                    avatar : upload.url
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

//Update user details
export async function updateUserDetails( request, response) {
     try {
          //get user id from middleware
          const userId = request.userId; //auth middleware

          //frontend validation
          const { name, email, mobile, password } = request.body;

          //password encryption
          let hashPassword = "";
          if (password) {
               const salt = await bcryptjs.genSalt(10);
               hashPassword = await bcryptjs.hash(password, salt);
          }

          //database validation
          const updateUser = await UserModel.updateOne({ _id : userId }, {
               ...(name && { name : name }),
               ...(email && { email : email }),
               ...(mobile && { mobile : mobile }),
               ...(password && { password : hashPassword }),
          })

          return response.json({
               message : "Updated User Successfully",
               error : false,
               success : true,
               data : updateUser
          })

     } catch (error) {
          return response.status(500).json({
               message : error.message || error,
               error : true,
               success : false
          })
     }
}

//Forgot password incase user is not Login
export async function forgotPasswordController( request, response ) {
     try {
          //frontend validation
          const { email } = request.body;

          //database validation
          const user = await UserModel.findOne({ email });

          //check user
          if (!user) {
               return response.status(400).json({
                    message : "Email not available",
                    error : true,
                    success : false
               })
          }

          //generate otp
          const otp = generatedOtp();
          const expireTime = new Date() + 60 * 60 * 1000; //1 hour

          //send email to user
          const update = await UserModel.findByIdAndUpdate(user._id, {
               forgot_password_otp : otp,
               forgot_password_expiry : new Date(expireTime).toISOString()
          })

          await sendEmail({
               sendTo : email,
               subject : "Forgot Password from Binkeyit",
               html : forgotPasswordTemplate({
                    name : user.name,
                    otp : otp
               })
          })

          return response.json({
               message : "check your email",
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

//verify forgot password otp
export async function verifyForgotPasswordOtp( request, response ) {
     try {
           //frontend validation
           const { email, otp } = request.body;

           //database validation
           if ( !email || !otp) {
               return response.status(400).json({
                    message : "Provide required email, otp.",
                    error : true,
                    success : false
               })
           }

           const user = await UserModel.findOne({ email });
 
           //check user
           if (!user) {
                return response.status(400).json({
                     message : "Email not available",
                     error : true,
                     success : false
                })
           }

           //check otp
           const currentTime = new Date().toISOString()

           if (user.forgot_password_expiry < currentTime) {
               return response.status(400).json({
                    message : "Otp is expired",
                    error : true,
                    success : false
               })
           }

           //check otp cross verify with database
           if (otp !== user.forgot_password_otp) {
               return response.status(400).json({
                    message : "Invalid Otp",
                    error : true,
                    success : false
               })
           }

           //if otp is not expired
           //otp === user.forgot_password_otp

           const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
               forgot_password_otp : "",
               forgot_password_expiry : ""
           })

           return response.json({
               message : "Otp verified",
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

//reset the password
export async function resetPassword( request, response ) {
     try {
          //frontend validation
          const { email , newPassword , confirmPassword } = request.body;

          //database validation
          if (!email || !newPassword || !confirmPassword) {
               return response.status(400).json({
                    message : "Provide required fields email, newPassword, confirmPassword",
               })
          }

          const user = await UserModel.findOne({ email });

          if (!user) {
               return response.status(400).json({
                    message : "Email not available",
                    error : true,
                    success : false
               })
          }

          if ( newPassword !== confirmPassword) {
               return response.status(400).json({
                    message : "newPassword and confirmPassword must be same",
                    error : true,
                    success : false
               })
          }

          const salt = await bcryptjs.genSalt(10);
          const hashPassword = await bcryptjs.hash(newPassword, salt);

          const update = await UserModel.findByIdAndUpdate( user._id , {
               password : hashPassword
          })

          return response.json({
               message : "Password updated Successfully",
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

//refresh token controller
export async function refresToken( request, response ) {
     try {
          
          const refreshToken = request.cookies.refreshToken || request?.header?.authorization?.split(" ")[1] // [Bearer, token]

          //check token
          if (!refresToken) {
               return response.status(400).json({
                    message : "Invalid Token",
                    error : true,
                    success : false
               })
          }

          //verify token
          const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN) 

          if (!verifyToken) {
               return response.status(400).json({
                    message : "Token is Expired",
                    error : true,
                    success : false
               })
          }

          //get user id
          const userId = verifyToken?._id;
          const newAccessToken = await generatedAccessToken(userId)

          const cookiesOption = {
               httpOnly : true,
               secure : true,
               sameSite : "None"
          }

          response.cookie("accessToken", newAccessToken, cookiesOption)

          return response.json({
               message : "New Access Token Generated",
               error : false,
               success : true,
               data : {
                    accessToken : newAccessToken
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

//get login user details
export async function userDetails(request, response) {
    try {
        const userId = request.userId;
        const user = await UserModel.findById(userId).select('-password -refresh_token');
        return response.json({
            message: "user details",
            data: user,
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: "Something is wrong",
            error: true,
            success: false
        });
    }
}
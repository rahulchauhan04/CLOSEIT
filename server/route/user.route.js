import { Router } from 'express';
import { 
     forgotPasswordController,
     loginUserController, 
     logoutControoller, 
     refresToken, 
     registerUserController, 
     resetPassword, 
     updateUserDetails, 
     uploadAvatar, 
     userDetails, 
     verifyEmailController, 
     verifyForgotPasswordOtp} from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const userRouter = Router();

userRouter.post('/register', registerUserController)
userRouter.post('/verify-email', verifyEmailController)
userRouter.post('/login', loginUserController)
userRouter.get('/logout', auth, logoutControoller)
userRouter.put('/upload-avatar', auth, upload.single('avatar'), uploadAvatar)
userRouter.put('/update-user', auth, updateUserDetails)
userRouter.put('/forgot-password', forgotPasswordController)
userRouter.put('/verify-forgot-password-otp', verifyForgotPasswordOtp)
userRouter.put('/reset-password', resetPassword)
userRouter.post('/refresh-token', refresToken)
userRouter.get('/user-details',auth,userDetails)

export default userRouter;
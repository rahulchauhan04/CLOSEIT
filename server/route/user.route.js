import { Router } from 'express';
import { loginUserController, logoutControoller, registerUserController, verifyEmailController } from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';

const userRouter = Router();

userRouter.post('/register', registerUserController)
userRouter.post('/verify-email', verifyEmailController)
userRouter.post('/login', loginUserController)
userRouter.get('/logout', auth, logoutControoller)

export default userRouter;
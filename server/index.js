import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';
import userRouter from './route/user.route.js';
import categoryRouter from './route/category.route.js';
import uploadRouter from './route/upload.router.js';

const app = express();

app.use(cors({
     credentials: true,
     origin: process.env.FRONTEND_URL
}))

app.use(express.json());
app.use(cookieParser());
app.use(morgan());
app.use(helmet({
     crossOriginResourcePolicy: false
}))

const PORT = 8080 || process.env.PORT

app.get('/', (request, response) => {
     response.json({
          message: "Server is Running " + PORT
     })
})

app.use('/api/user', userRouter)
app.use('/api/category', categoryRouter)
app.use('/api/file', uploadRouter)

connectDB().then(() => {
     app.listen(PORT, () => {
          console.log("Server is running on port", PORT)
     })
});


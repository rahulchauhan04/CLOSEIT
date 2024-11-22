import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();

app.use(cors({
     credentials: true,
     origin: 'process.env.FRONTEND_URL'
}))
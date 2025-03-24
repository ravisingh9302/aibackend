import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createDbConnection } from './config/dbconfig';
import { errorMiddleware, CustomError } from './middlewares/errorHandler';
import path from 'path';
import router from './routes/routes';
import assemblyRouter from './routes/assemblyRoutes';



dotenv.config();
const app = express();
const PORT = process.env.SERVER_PORT || 4000;


const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
const corsOptions = {
  origin: (origin: string | undefined, callback: any) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// const corsOptions = {
//   origin: "*",
//   credentials: true,
// };


// Middleware
app.use(cors(corsOptions));
app.use(compression()); // Use compression for gzip compression
app.use(cookieParser()); // Use cookie-parser for parsing cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Database connection
createDbConnection().then(() => {
  console.log('Connected to database');
}).catch(err => console.log('Database connection failed', err));

app.get('/', (req, res) => {
  res.send('ai interview')
})

app.use('/api/v1', router)
app.use("/api/v1/assembly", assemblyRouter);

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorMiddleware) //global error handler


app.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT);
});
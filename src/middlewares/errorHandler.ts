

//CUSTOM ERROR HANDLER

import { Request, Response, NextFunction,  } from "express";
class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}


//GLOBAL ERROR HANDLER

const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Error:", err);
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  // in production, don't send stack trace to client
  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };
  res.status(status).json({ success: false, message });
};

export { CustomError, errorMiddleware };

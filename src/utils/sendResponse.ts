import { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const sendResponse = <T>(res: Response, statusCode: number, message: string, data?: T) => {
  const response: ApiResponse<T> = {
    success: statusCode < 400, // success if status is < 400
    message,
    ...(data !== undefined && { data }),
  };
  res.status(statusCode).json(response);
};

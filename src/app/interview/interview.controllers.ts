import prisma from '../../config/dbconfig';
import { Request, Response } from 'express';

import asyncHandler from '../../utils/asyncHandler';
import { CustomError } from '../../middlewares/errorHandler';
import { sendResponse } from '../../utils/sendResponse';
import { extractResumeInside, mockinterview } from '../../lib/gemini';

// @access  PUBLIC ROUTES
// @route   http://localhost:5000/api/v1/public/

import { Multer } from 'multer';

// Define a custom interface for file handling
interface CustomMulterFile extends Express.Multer.File {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

interface MulterRequest extends Request {
  file?: CustomMulterFile;
}

/**
 * @route   GET /test-series
 * @desc     get all test series
 */
const startInterview = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { companyType, role } = req.body;
    const history: { question: string; answer: string }[] = [];

    const question = await mockinterview(companyType, role, history);
    sendResponse(res, 200, 'All test series retrieved successfully', question);
  } catch (error) {
    throw new CustomError('Failed to start interview', 500);
  }
});

const nextQuestion = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { companyType, role, history } = req.body;
    const question = await mockinterview(companyType, role, history);
    sendResponse(res, 200, 'All test series retrieved successfully', question);
  } catch (error) {
    throw new CustomError('Failed to get next question', 500);
  }
});


const extractResume = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { companyType, role } = req.body;
    const resume = req.file; // Assuming you're using a middleware like multer to handle file uploads

    if (!resume) {
      throw new CustomError('Resume file is required', 400);
    }

    // Process the resume file (e.g., save it, extract data, etc.)
    const resumeData = await extractResumeInside(resume.buffer);

    // For now, let's just send a response back with the received data
    sendResponse(res, 200, 'Resume received successfully', { companyType, role, resumeData });
  } catch (error) {
    throw new CustomError('Failed to get next question', 500);
  }
});

export const PublicController = {
  startInterview,
  nextQuestion,
  extractResume
};
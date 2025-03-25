import prisma from '../../config/dbconfig';
import { Request, Response } from 'express';

import asyncHandler from '../../utils/asyncHandler';
import { CustomError } from '../../middlewares/errorHandler';
import { extractResumeInside } from '../../lib/gemini';


interface CustomMulterFile extends Express.Multer.File {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

interface MulterRequest extends Request {
  file?: CustomMulterFile;
}

const extractResume = asyncHandler(async (req: MulterRequest, res: Response) => {
  console.log("hello")
  try {
    const resume = req.file; // Assuming you're using a middleware like multer to handle file uploads

    if (!resume) {
      throw new CustomError('Resume file is required', 400);
    }

    // Process the resume file (e.g., save it, extract data, etc.)
    const resumeData = await extractResumeInside(resume.buffer);
    console.log("the resueme data for the resume is:::", resumeData);
    // For now, let's just send a response back with the received data
    res.status(200).json({
      success: true,
      message: 'Resume data extracted successfully',
      data: resumeData
    });
  } catch (error) {
    console.log(error);
    throw new CustomError('Internal server error', 500);
  }
});

export const PublicController = {
  extractResume
};
import prisma from '../../config/dbconfig';
import { Request, Response } from 'express';
import axios from "axios";
import asyncHandler from '../../utils/asyncHandler';
import { CustomError } from '../../middlewares/errorHandler';
import { sendResponse } from '../../utils/sendResponse';
import { extractResumeInside} from '../../lib/gemini';
import multer from 'multer';
// const upload = multer();

// @access  PUBLIC ROUTES
// @route   http://localhost:5000/api/v1/public/


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

const textTospeech = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    console.log("text", text);
    // const question = await mockinterview(companyType, role, history);

    const data = JSON.stringify({
      "text": text,
      "voiceId": "en-US-natalie"
    });


    let config = {
      method: 'post',
      url: 'https://api.murf.ai/v1/speech/generate',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'api-key': 'ap2_09024d6d-dd09-4112-9108-36c7b3c2ec66'
      },
      data: data
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        sendResponse(res, 200, 'text to speech', response.data);
      })
      .catch((error) => {
        console.log(error);
      });

  
  } catch (error) {
    throw new CustomError('Failed to get next question', 500);
  }
});


const extractResume = asyncHandler(async (req: MulterRequest, res: Response) => {
  console.log("hello")
  try {

  

    // console.log("req.body", req.body);
    console.log("req.file", req.file);
    const resume = req.file; // Assuming you're using a middleware like multer to handle file uploads

    if (!resume) {
      throw new CustomError('Resume file is required', 400);
    }

    // Process the resume file (e.g., save it, extract data, etc.)
    const resumeData = await extractResumeInside(resume.buffer);
    if (resumeData) {
     console.log("RESUME DATA EXTRACTED")
    }
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
  extractResume,
  textTospeech
};
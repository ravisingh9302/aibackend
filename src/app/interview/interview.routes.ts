import express from 'express';
import multer from 'multer';
import { PublicController } from './interview.controllers';
const upload = multer();
const router = express.Router();


// Public routes
router.post('/start', PublicController.startInterview);
router.post('/next', PublicController.nextQuestion);
router.post('/extract-resume', upload.single('resume'), PublicController.extractResume);


export const InterviewRouter = router;
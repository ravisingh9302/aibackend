import express from 'express';
import multer from 'multer';
import { PublicController } from './interview.controllers';
const upload = multer();
const router = express.Router();


// Public routes
router.post('/start', PublicController.startInterview);
router.post('/start', PublicController.startInterview);
router.post('/text-to-speech', PublicController.textTospeech);
router.post('/extract-resume', upload.single('resume'), PublicController.extractResume);


export const InterviewRouter = router;
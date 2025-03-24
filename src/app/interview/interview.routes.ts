import express from 'express';
import { PublicController } from './interview.controllers';
const router = express.Router();

// Public routes
router.post('/start', PublicController.startInterview);
router.post('/next', PublicController.nextQuestion);
router.post('/extract-resume', PublicController.extractResume);


export const PublicRouter = router;
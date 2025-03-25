import express from 'express';
import { InterviewRouter } from '../app/interview/interview.routes';
const router = express.Router();

router.use('/interview', InterviewRouter);

export default router;

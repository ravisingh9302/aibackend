import express from 'express';
// import { AuthRouter } from '../app/auth/auth.routes';
import { InterviewRouter } from '../app/interview/interview.routes';

const router = express.Router();

router.use('/interview', InterviewRouter);

// router.use('/auth', AuthRouter);
// router.use('/admin', AdminRouter);
// router.use('/teacher', TeacherRouter);
// router.use('/student', UserRouter);
// router.use('/public', PublicRouter);

export default router;

import express from 'express';
// import { AuthRouter } from '../app/auth/auth.routes';
// import { AdminRouter } from '../app/admin/admin.routes';
// import { TeacherRouter } from '../app/teacher/teacher.routes';
// import { UserRouter } from '../app/student/student.routes';
// import { PublicRouter } from '../app/public/public.routes';
const router = express.Router();

router.use('/interview', InterviewRouter);

router.use('/interview', InterviewRouter);


export default router;

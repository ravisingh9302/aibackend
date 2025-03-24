import prisma from '../../config/dbconfig';
import { Request, Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { CustomError } from '../../middlewares/errorHandler';
import { sendResponse } from '../../utils/sendResponse';

// @access  PUBLIC ROUTES
// @route   http://localhost:5000/api/v1/public/


/**
 * @route   GET /test-series
 * @desc     get all test series
 */
const getAllTestSeries = asyncHandler(async (req: Request, res: Response) => {
  const testSeries = await prisma.allTestSeries.findMany();
  sendResponse(res, 200, 'All test series retrieved successfully', testSeries);
});

/**
 * @route   GET /test-series/:id
 * @desc     get test series details
 */
const getTestSeriesDetails = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const testSeries = await prisma.allTestSeries.findUnique({
    where: { id },
    include: { tests: true },
  });
  if (!testSeries) throw new CustomError('Test series not found', 404);
  sendResponse(res, 200, 'Test series details retrieved successfully', testSeries);
});

/**
 * @route   POST /logout
 * @desc    logout all user
 */
const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie('mocktoken');
  // res.clearCookie('mockrefreshtoken');
  sendResponse(res, 200, 'Logged out successfully');
});



export const PublicController = {
  getAllTestSeries,
  getTestSeriesDetails,
  logout,
  
};
import express from "express";
import axios from "axios";
import asyncHandler from "express-async-handler";

const assemblyRouter = express.Router();

assemblyRouter.get(
  "/get-token",
  asyncHandler(async (req, res) => {
    try {
      const response = await axios.post(
        "https://api.assemblyai.com/v2/realtime/token",
        {},
        {
          headers: {
            Authorization: process.env.ASSEMBLYAI_API_KEY!,
            "Content-Type": "application/json",
          },
        }
      );

      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  })
);

export default assemblyRouter;

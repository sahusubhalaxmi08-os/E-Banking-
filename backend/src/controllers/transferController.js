
import asyncHandler from "../utils/asyncHandler.js";
import { transferFunds } from "../services/transferService.js";

export const createTransfer = asyncHandler(async (req, res) => {
  const transfer = await transferService({
    userId: req.user._id,
    ...req.validated.body,
  });

  res.status(201).json({
    success: true,
    message: "Transfer completed successfully",
    transfer,
  });
});
import BankCard from "../models/BankCard.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getMyCards = asyncHandler(async (req, res) => {
  const cards = await BankCard.find({
    owner: req.user._id,
  })
    .select("last4 holderName status expiresAt account createdAt")
    .sort({ createdAt: -1 })
    .lean();

  res.json({ success: true, cards });
});
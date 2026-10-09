
import mongoose from "mongoose";
import BankCard from "../models/BankCard.js";
import Account from "../models/Account.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

// Get cards belonging to the logged-in user
export const getMyCards = asyncHandler(async (req, res) => {
  const cards = await BankCard.find({
    owner: req.user._id,
  })
    .populate("account", "accountNumber accountType")
    .select("-__v")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: cards,
  });
});

// Create a demo bank card
export const createBankCard = asyncHandler(async (req, res) => {
  const { accountId, holderName, last4 } = req.body;

  if (!accountId || !mongoose.isValidObjectId(accountId)) {
    throw new ApiError(400, "A valid account ID is required.");
  }

  if (!holderName || !holderName.trim()) {
    throw new ApiError(400, "Cardholder name is required.");
  }

  if (!/^\d{4}$/.test(String(last4 || ""))) {
    throw new ApiError(400, "Enter exactly four digits for the card ending.");
  }

  const account = await Account.findOne({
    _id: accountId,
    owner: req.user._id,
    status: "active",
  });

  if (!account) {
    throw new ApiError(
      404,
      "Active account not found for the logged-in user."
    );
  }

  const card = await BankCard.create({
    owner: req.user._id,
    account: account._id,
    holderName: holderName.trim(),
    last4: String(last4),
    status: "active",
  });

  res.status(201).json({
    success: true,
    message: "Demo bank card created successfully.",
    data: card,
  });
});

// Block a card belonging to the logged-in user
export const blockBankCard = asyncHandler(async (req, res) => {
  const { cardId } = req.params;

  if (!mongoose.isValidObjectId(cardId)) {
    throw new ApiError(400, "Invalid card ID.");
  }

  const card = await BankCard.findOneAndUpdate(
    {
      _id: cardId,
      owner: req.user._id,
      status: "active",
    },
    {
      $set: { status: "blocked" },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!card) {
    throw new ApiError(404, "Active card not found.");
  }

  res.status(200).json({
    success: true,
    message: "Card blocked successfully.",
    data: card,
  });
});


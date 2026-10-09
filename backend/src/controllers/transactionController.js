
import mongoose from "mongoose";
import crypto from "crypto";
import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

// Get transaction history
export const getTransactions = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  const filter = {
    owner: req.user._id,
  };

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Transaction.countDocuments(filter),
  ]);

  const formattedTransactions = transactions.map((transaction) => ({
    ...transaction,
    amount: transaction.amountPaise / 100,
    direction: transaction.type,
  }));

  res.status(200).json({
    success: true,
    data: formattedTransactions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// Deposit money
export const depositMoney = asyncHandler(async (req, res) => {
  const { accountId, amount, description = "Money deposit" } = req.body;

  if (!accountId || !mongoose.isValidObjectId(accountId)) {
    throw new ApiError(400, "Valid account ID is required.");
  }

  const amountNumber = Number(amount);

  if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
    throw new ApiError(400, "Please enter a valid deposit amount.");
  }

  if (Math.round(amountNumber * 100) !== amountNumber * 100) {
    throw new ApiError(400, "Amount can have at most two decimal places.");
  }

  const amountPaise = Math.round(amountNumber * 100);

  if (!Number.isSafeInteger(amountPaise)) {
    throw new ApiError(400, "Deposit amount is too large.");
  }

  const account = await Account.findOneAndUpdate(
    {
      _id: accountId,
      owner: req.user._id,
      status: "active",
      balancePaise: { $lte: Number.MAX_SAFE_INTEGER - amountPaise },
    },
    {
      $inc: { balancePaise: amountPaise },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!account) {
    throw new ApiError(
      400,
      "Account not found, inactive, or unable to accept this deposit."
    );
  }

  try {
    const transaction = await Transaction.create({
      reference: `DEP-${crypto.randomUUID()}`,
      type: "credit",
      account: account._id,
      owner: account.owner,
      amountPaise,
      currency: "INR",
      description: String(description).trim().slice(0, 120),
      status: "completed",
    });

    res.status(201).json({
      success: true,
      message: "Deposit completed successfully.",
      data: {
        transaction: {
          ...transaction.toObject(),
          amount: transaction.amountPaise / 100,
          direction: transaction.type,
        },
        balance: account.balancePaise / 100,
      },
    });
  } catch (error) {
    // Attempt to roll back the balance if transaction recording fails.
    await Account.updateOne(
      {
        _id: account._id,
        balancePaise: { $gte: amountPaise },
      },
      {
        $inc: { balancePaise: -amountPaise },
      }
    );

    throw error;
  }
});

// Transfer money between accounts
export const transferMoney = asyncHandler(async (req, res) => {
  const {
    fromAccount,
    beneficiaryAccount,
    amount,
    note = "Bank transfer",
  } = req.body;

  if (!fromAccount || !mongoose.isValidObjectId(fromAccount)) {
    throw new ApiError(400, "Valid sender account ID is required.");
  }

  if (!beneficiaryAccount || typeof beneficiaryAccount !== "string") {
    throw new ApiError(400, "Recipient account number is required.");
  }

  const amountNumber = Number(amount);

  if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
    throw new ApiError(400, "Please enter a valid transfer amount.");
  }

  if (Math.round(amountNumber * 100) !== amountNumber * 100) {
    throw new ApiError(400, "Amount can have at most two decimal places.");
  }

  const amountPaise = Math.round(amountNumber * 100);

  if (!Number.isSafeInteger(amountPaise)) {
    throw new ApiError(400, "Transfer amount is too large.");
  }

  if (typeof note !== "string" || note.length > 120) {
    throw new ApiError(400, "Transfer note must be at most 120 characters.");
  }

  const recipientAccountNumber = beneficiaryAccount.trim();

  if (!recipientAccountNumber) {
    throw new ApiError(400, "Recipient account number is required.");
  }

  const reference = `TRF-${crypto.randomUUID()}`;
  const description = note.trim() || "Bank transfer";

  const session = await mongoose.startSession();
  let transferResult;

  try {
    await session.withTransaction(async () => {
      // Verify sender account belongs to the logged-in user.
      const sender = await Account.findOne({
        _id: fromAccount,
        owner: req.user._id,
        status: "active",
      }).session(session);

      if (!sender) {
        throw new ApiError(
          404,
          "Sender account not found or inactive."
        );
      }

      // Find the recipient using their account number.
      const recipient = await Account.findOne({
        accountNumber: recipientAccountNumber,
        status: "active",
      }).session(session);

      if (!recipient) {
        throw new ApiError(404, "Recipient account not found or inactive.");
      }

      if (sender._id.equals(recipient._id)) {
        throw new ApiError(
          400,
          "You cannot transfer money to the same account."
        );
      }

      if (recipient.balancePaise > Number.MAX_SAFE_INTEGER - amountPaise) {
        throw new ApiError(400, "Recipient balance limit would be exceeded.");
      }

      // Debit sender only if sufficient balance is available.
      const updatedSender = await Account.findOneAndUpdate(
        {
          _id: sender._id,
          owner: req.user._id,
          status: "active",
          balancePaise: { $gte: amountPaise },
        },
        {
          $inc: { balancePaise: -amountPaise },
        },
        {
          new: true,
          session,
          runValidators: true,
        }
      );

      if (!updatedSender) {
        throw new ApiError(400, "Insufficient balance.");
      }

      // Credit recipient.
      const updatedRecipient = await Account.findOneAndUpdate(
        {
          _id: recipient._id,
          status: "active",
          balancePaise: {
            $lte: Number.MAX_SAFE_INTEGER - amountPaise,
          },
        },
        {
          $inc: { balancePaise: amountPaise },
        },
        {
          new: true,
          session,
          runValidators: true,
        }
      );

      if (!updatedRecipient) {
        throw new ApiError(
          400,
          "Recipient account cannot receive this transfer."
        );
      }

      // Record both transactions atomically.
      // IMPORTANT FIX: ordered: true
      const [debitTransaction, creditTransaction] =
        await Transaction.create(
          [
            {
              reference: `${reference}-OUT`,
              type: "debit",
              account: updatedSender._id,
              relatedAccount: updatedRecipient._id,
              owner: updatedSender.owner,
              amountPaise,
              currency: "INR",
              description,
              status: "completed",
            },
            {
              reference: `${reference}-IN`,
              type: "credit",
              account: updatedRecipient._id,
              relatedAccount: updatedSender._id,
              owner: updatedRecipient.owner,
              amountPaise,
              currency: "INR",
              description: `Transfer received: ${description}`,
              status: "completed",
            },
          ],
          {
            session,
            ordered: true,
          }
        );

      transferResult = {
        reference,
        amount: amountPaise / 100,
        currency: "INR",
        senderBalance: updatedSender.balancePaise / 100,
        recipientBalance: updatedRecipient.balancePaise / 100,
        debitTransaction,
        creditTransaction,
      };
    });

    res.status(201).json({
      success: true,
      message: "Money transferred successfully.",
      data: transferResult,
    });
  } finally {
    await session.endSession();
  }
});


import mongoose from "mongoose";
import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";
import Beneficiary from "../models/Beneficiary.js";
import Notification from "../models/Notification.js";
import ApiError from "../utils/ApiError.js";
import { generateReference } from "../utils/generateAccountNumber.js";

const MAX_TRANSFER_PAISE = 100000000; // ₹10,00,000 per transfer

export async function transferFunds(userId, data) {
  const amountPaise = Math.round(data.amount * 100);

  if (
    !Number.isSafeInteger(amountPaise) ||
    amountPaise <= 0 ||
    amountPaise > MAX_TRANSFER_PAISE
  ) {
    throw new ApiError(400, "Invalid amount or transfer limit exceeded.");
  }

  const session = await mongoose.startSession();
  let result;

  try {
    await session.withTransaction(async () => {
      const sender = await Account.findOne({
        _id: data.fromAccount,
        owner: userId,
        status: "active",
      }).session(session);

      if (!sender) {
        throw new ApiError(404, "Active source account not found.");
      }

      const recipient = await Account.findOne({
        accountNumber: data.beneficiaryAccount,
        status: "active",
      }).session(session);

      if (!recipient) {
        throw new ApiError(404, "Recipient account not found.");
      }

      if (sender._id.equals(recipient._id)) {
        throw new ApiError(400, "Cannot transfer to the same account.");
      }

      const beneficiary = await Beneficiary.findOne({
        owner: userId,
        account: recipient._id,
      }).session(session);

      if (!beneficiary) {
        throw new ApiError(
          403,
          "Add this recipient as a beneficiary before transferring."
        );
      }

      // Atomic conditional debit prevents a negative balance.
      const debited = await Account.findOneAndUpdate(
        {
          _id: sender._id,
          owner: userId,
          status: "active",
          balancePaise: { $gte: amountPaise },
        },
        {
          $inc: { balancePaise: -amountPaise },
        },
        {
          new: true,
          session,
        }
      );

      if (!debited) {
        throw new ApiError(400, "Insufficient funds or account unavailable.");
      }

      // Credit is part of the same database transaction.
      const credited = await Account.findOneAndUpdate(
        {
          _id: recipient._id,
          status: "active",
        },
        {
          $inc: { balancePaise: amountPaise },
        },
        {
          new: true,
          session,
        }
      );

      if (!credited) {
        throw new ApiError(409, "Recipient account is unavailable.");
      }

      const reference = generateReference();
      const description = data.note || "Bank transfer";

      const transactions = await Transaction.create(
        [
          {
            reference,
            type: "debit",
            account: sender._id,
            relatedAccount: recipient._id,
            owner: sender.owner,
            amountPaise,
            description,
            status: "completed",
          },
          {
            reference,
            type: "credit",
            account: recipient._id,
            relatedAccount: sender._id,
            owner: recipient.owner,
            amountPaise,
            description: "Incoming bank transfer",
            status: "completed",
          },
        ],
        { session }
      );

      await Notification.create(
        [
          {
            user: sender.owner,
            title: "Transfer completed",
            message: `Your transfer of ₹${(amountPaise / 100).toFixed(2)} was completed. Reference: ${reference}`,
            type: "success",
          },
          {
            user: recipient.owner,
            title: "Money received",
            message: `Your account received ₹${(amountPaise / 100).toFixed(2)}. Reference: ${reference}`,
            type: "success",
          },
        ],
        { session }
      );

      result = {
        reference,
        amount: amountPaise / 100,
        currency: "INR",
        status: "completed",
        senderBalance: debited.balancePaise / 100,
        recipientBalance: credited.balancePaise / 100,
        transactions,
      };
    });
  } finally {
    await session.endSession();
  }

  return result;
}
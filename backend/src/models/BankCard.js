import mongoose from "mongoose";

const bankCardSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    last4: {
      type: String,
      required: true,
      match: /^\d{4}$/,
    },
    holderName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    status: {
      type: String,
      enum: ["active", "blocked", "expired"],
      default: "active",
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("BankCard", bankCardSchema);
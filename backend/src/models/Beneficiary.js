import mongoose from "mongoose";

const beneficiarySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
  },
  { timestamps: true }
);

beneficiarySchema.index(
  { owner: 1, accountNumber: 1 },
  { unique: true }
);

export default mongoose.model("Beneficiary", beneficiarySchema);

import Beneficiary from "../models/Beneficiary.js";
import Account from "../models/Account.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Get beneficiaries for the logged-in user
export const getBeneficiaries = asyncHandler(async (req, res) => {
  const beneficiaries = await Beneficiary.find({
    owner: req.user._id,
  })
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json({
    success: true,
    beneficiaries,
  });
});

// Add a new beneficiary
export const createBeneficiary = asyncHandler(async (req, res) => {
  // Prefer validated data, but fall back to req.body if a field is missing.
  const validatedBody = req.validated?.body;
  const body = req.body ?? {};

  const nameValue =
    typeof validatedBody?.name === "string"
      ? validatedBody.name
      : body.name;

  const accountNumberValue =
    typeof validatedBody?.accountNumber === "string"
      ? validatedBody.accountNumber
      : body.accountNumber;

  if (
    typeof nameValue !== "string" ||
    typeof accountNumberValue !== "string"
  ) {
    console.error("Invalid beneficiary request body:", {
      bodyKeys: Object.keys(body),
      validatedKeys:
        validatedBody && typeof validatedBody === "object"
          ? Object.keys(validatedBody)
          : [],
    });

    throw new ApiError(
      400,
      "Beneficiary name and account number are required."
    );
  }

  const name = nameValue.trim();
  const accountNumber = accountNumberValue.trim();

  if (!name || !accountNumber) {
    throw new ApiError(
      400,
      "Beneficiary name and account number cannot be empty."
    );
  }

  if (name.length > 80) {
    throw new ApiError(
      400,
      "Beneficiary name cannot exceed 80 characters."
    );
  }

  // Find the recipient's active account
  const account = await Account.findOne({
    accountNumber,
    status: "active",
  });

  if (!account) {
    throw new ApiError(
      404,
      "Active recipient account not found."
    );
  }

  // Prevent adding the logged-in user's own account
  if (account.owner.equals(req.user._id)) {
    throw new ApiError(
      400,
      "You cannot add your own account as a beneficiary."
    );
  }

  // Check whether this beneficiary already exists
  const existingBeneficiary = await Beneficiary.findOne({
    owner: req.user._id,
    accountNumber: account.accountNumber,
  });

  if (existingBeneficiary) {
    throw new ApiError(
      409,
      "This beneficiary has already been added."
    );
  }

  try {
    const beneficiary = await Beneficiary.create({
      owner: req.user._id,
      name,
      accountNumber: account.accountNumber,
      account: account._id,
    });

    return res.status(201).json({
      success: true,
      message: "Beneficiary added successfully.",
      beneficiary,
    });
  } catch (error) {
    // Handle duplicate-key errors from the unique database index
    if (error.code === 11000) {
      throw new ApiError(
        409,
        "This beneficiary has already been added."
      );
    }

    throw error;
  }
});
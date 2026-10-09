
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {
  registerUser,
  loginUser,
  publicUser,
} from "../services/authService.js";

// Register customer
export const register = asyncHandler(async (req, res) => {
  const data = req.validated?.body ?? req.body;

  const result = await registerUser(data);

  res.status(201).json({
    success: true,
    message: "Registration successful",
    ...result,
  });
});

// Login customer
export const login = asyncHandler(async (req, res) => {
  const data = req.validated?.body ?? req.body;

  const result = await loginUser(data);

  if (!result.token && !result.accessToken) {
    throw new ApiError(
      500,
      "Login service did not return an authentication token."
    );
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    ...result,
  });
});

// Get logged-in customer's profile
export const getMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Please log in first.");
  }

  res.status(200).json({
    success: true,
    user: publicUser(req.user),
  });
});

// Update logged-in customer's profile
export const updateMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Please log in first.");
  }

  const data = req.validated?.body ?? req.body;
  const { name, email } = data;

  if (email && email.toLowerCase().trim() !== req.user.email) {
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await req.user.constructor.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      throw new ApiError(409, "Email is already in use.");
    }

    req.user.email = normalizedEmail;
  }

  if (name !== undefined) {
    req.user.name = name;
  }

  await req.user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: publicUser(req.user),
  });
});


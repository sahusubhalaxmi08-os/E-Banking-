import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { env } from "../config/env.js";

export const protect = asyncHandler(async (req, res, next) => {
  // 1. Read the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(
      401,
      "Authentication required. Please log in."
    );
  }

  // 2. Extract the token
  const token = authHeader.slice("Bearer ".length).trim();

  if (!token) {
    throw new ApiError(
      401,
      "Authentication token is missing."
    );
  }

  // 3. Verify the JWT
  let decoded;

  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(
        401,
        "Your session has expired. Please log in again."
      );
    }

    throw new ApiError(
      401,
      "Invalid authentication token. Please log in again."
    );
  }

  // 4. Get the user ID from the token's subject
  const userId = decoded.sub;

  if (
    typeof userId !== "string" ||
    !mongoose.isValidObjectId(userId)
  ) {
    throw new ApiError(
      401,
      "Invalid user ID in token. Please log in again."
    );
  }

  // 5. Find the user
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(
      401,
      "User associated with this token was not found."
    );
  }

  // 6. Check account status
  if (user.isActive === false) {
    throw new ApiError(403, "Your account is inactive.");
  }

  // 7. Attach the authenticated user
  req.user = user;

  next();
});


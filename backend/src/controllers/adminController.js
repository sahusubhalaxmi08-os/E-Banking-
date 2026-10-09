
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Admin only
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("-password -passwordHash")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// @desc    Get a single user by ID
// @route   GET /api/admin/users/:id
// @access  Admin only
export const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select("-password -passwordHash");

  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Update a user's status
// @route   PATCH /api/admin/users/:id/status
// @access  Admin only
export const updateUserStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!["active", "suspended"].includes(status)) {
    return next(
      new ApiError(400, "Status must be active or suspended")
    );
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  user.status = status;
  await user.save();

  res.status(200).json({
    success: true,
    message: "User status updated successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
});
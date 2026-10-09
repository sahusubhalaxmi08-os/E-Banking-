import ApiError from "../utils/ApiError.js";

import asyncHandler from "../utils/asyncHandler.js";

export default function allowRoles(...roles) {
  return function (req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission."));
    }

    next();
  };
}




export const requireAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, "Please log in first"));
  }

  if (req.user.role !== "admin") {
    return next(
      new ApiError(403, "Access denied. Admin privileges required.")
    );
  }

  next();
});
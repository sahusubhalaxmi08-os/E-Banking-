import ApiError from "../utils/ApiError.js";

export default function notFoundMiddleware(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.path}`));
}
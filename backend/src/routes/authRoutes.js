
import { Router } from "express";

import {
  register,
  login,
  getMe,
  updateMe,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

import {
  registerSchema,
  loginSchema,
  profileSchema,
} from "../validators/schemas.js";

const router = Router();

// Register a customer
router.post("/register", validate(registerSchema), register);

// Login a customer
router.post("/login", validate(loginSchema), login);

// Get the logged-in customer's profile
router.get("/me", protect, getMe);

// Update the logged-in customer's profile
router.patch("/me", protect, validate(profileSchema), updateMe);

export default router;

import { Router } from "express";

import {
  getUsers,
  getUserById,
  updateUserStatus,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = Router();

// All routes require authentication and admin authorization
router.use(protect, requireAdmin);

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/status", updateUserStatus);

export default router;
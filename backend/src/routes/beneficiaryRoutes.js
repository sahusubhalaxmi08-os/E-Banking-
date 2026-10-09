
import { Router } from "express";

import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { beneficiarySchema } from "../validators/schemas.js";

import {
  getBeneficiaries,
  createBeneficiary,
} from "../controllers/beneficiaryController.js";

const router = Router();

// Require authentication for all beneficiary routes
router.use(protect);

// Get all beneficiaries for the logged-in user
router.get("/", getBeneficiaries);

// Create a new beneficiary
router.post("/", validate(beneficiarySchema), createBeneficiary);

export default router;


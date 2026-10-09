
import { Router } from "express";

import {
  getMyCards,
  createBankCard,
  blockBankCard,
} from "../controllers/bankCardController.js";

// Replace this import with your existing authentication middleware
// if your project uses a different filename or export.
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/", getMyCards);
router.post("/", createBankCard);
router.patch("/:cardId/block", blockBankCard);

export default router;

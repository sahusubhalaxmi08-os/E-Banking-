import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getTransactions,
  depositMoney,
  transferMoney,
} from "../controllers/transactionController.js";

const router = Router();

router.use(protect);

router.get("/", getTransactions);
router.post("/deposit", depositMoney);
router.post("/transfer", transferMoney);

export default router;
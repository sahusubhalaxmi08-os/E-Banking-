import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMyAccounts } from "../controllers/accountController.js";

const router = Router();

router.use(protect);
router.get("/me", getMyAccounts);

export default router;
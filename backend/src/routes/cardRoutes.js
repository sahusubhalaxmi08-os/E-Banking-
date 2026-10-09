import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMyCards } from "../controllers/cardController.js";

const router = Router();

router.use(protect);
router.get("/", getMyCards);

export default router;
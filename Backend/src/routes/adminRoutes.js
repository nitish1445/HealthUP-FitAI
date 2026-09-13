import { Router } from "express";
import { getAdminOverview, listUsers } from "../controllers/adminController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

// Protect all admin routes and restrict access to admin users only
router.use(protect, restrictTo("admin"));

router.get("/overview", getAdminOverview);
router.get("/users", listUsers);

export default router;

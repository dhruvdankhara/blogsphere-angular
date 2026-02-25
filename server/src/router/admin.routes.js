import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAllBlogsAdmin,
  deleteBlogAdmin,
  getDashboardStats,
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/rbac.middleware.js";

const router = Router();

// All admin routes require login + ADMIN role
router.use(verifyJWT, verifyRole("ADMIN"));

// Dashboard
router.route("/dashboard").get(getDashboardStats);

// User management
router.route("/users").get(getAllUsers);
router.route("/users/:userId").get(getUserById).delete(deleteUser);
router.route("/users/:userId/role").patch(updateUserRole);

// Blog management
router.route("/blogs").get(getAllBlogsAdmin);
router.route("/blogs/:blogId").delete(deleteBlogAdmin);

export default router;

import { Router } from "express";
import {
  reportBlogPost,
  getAllReports,
  updateReportStatus,
  deleteReport,
} from "../controllers/report.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/rbac.middleware.js";

const router = Router();

// any logged-in user can report a blog
router.route("/:blogId").post(verifyJWT, reportBlogPost);

// admin-only routes
router.route("/").get(verifyJWT, verifyRole("ADMIN"), getAllReports);

router
  .route("/:reportId/status")
  .patch(verifyJWT, verifyRole("ADMIN"), updateReportStatus);

router.route("/:reportId").delete(verifyJWT, verifyRole("ADMIN"), deleteReport);

export default router;

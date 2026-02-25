import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/rbac.middleware.js";
import upload from "../middlewares/multer.middlewares.js";

const router = Router();

router
  .route("/")
  .get(getAllCategories)
  .post(
    verifyJWT,
    verifyRole("ADMIN"),
    upload.single("featureImage"),
    createCategory
  );

router
  .route("/:categoryId")
  .get(getCategoryById)
  .patch(
    verifyJWT,
    verifyRole("ADMIN"),
    upload.single("featureImage"),
    updateCategory
  )
  .delete(verifyJWT, verifyRole("ADMIN"), deleteCategory);

export default router;

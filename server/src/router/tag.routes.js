import { Router } from "express";
import {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  searchTags,
  findOrCreateTag,
} from "../controllers/tag.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/rbac.middleware.js";

const router = Router();

router.route("/search").get(searchTags);
router.route("/find-or-create").post(verifyJWT, findOrCreateTag);

router
  .route("/")
  .get(getAllTags)
  .post(verifyJWT, verifyRole("ADMIN"), createTag);

router
  .route("/:tagId")
  .get(getTagById)
  .patch(verifyJWT, verifyRole("ADMIN"), updateTag)
  .delete(verifyJWT, verifyRole("ADMIN"), deleteTag);

export default router;

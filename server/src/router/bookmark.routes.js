import { Router } from "express";
import {
  addBookmark,
  removeBookmark,
  getMyBookmarks,
  getBookmarkStatus,
} from "../controllers/bookmark.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// all bookmark routes require authentication
router.use(verifyJWT);

router.route("/").get(getMyBookmarks);

router.route("/:blogId").post(addBookmark).delete(removeBookmark);

router.route("/:blogId/status").get(getBookmarkStatus);

export default router;

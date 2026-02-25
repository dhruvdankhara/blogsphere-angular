import { Router } from "express";
import {
  verifyJWT,
  getLoggedInUserOrIgnore,
} from "../middlewares/auth.middleware.js";
import {
  followUser,
  getUserPost,
  unfollowUser,
  getUserProfile,
  getFollowersList,
  getFollowingList,
  getUserStats,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/:username").get(getLoggedInUserOrIgnore, getUserProfile);

router.route("/:username/stats").get(getUserStats);

router.route("/:username/follow").post(verifyJWT, followUser);
router.route("/:username/unfollow").post(verifyJWT, unfollowUser);

router.route("/:username/followers").get(getFollowersList);
router.route("/:username/following").get(getFollowingList);

router.route("/:username/blogs").get(getUserPost);

export default router;

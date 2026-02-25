import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";
import Follow from "../models/follow.model.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  const username = req.params.username;

  const user = await User.findOne({ username }).select("-password -__v");

  if (!user) {
    throw new ApiError(404, "User not found with this username");
  }

  const followersCount = await Follow.countDocuments({ following: user._id });
  const followingCount = await Follow.countDocuments({ follower: user._id });

  let isFollowing = false;

  if (req.user) {
    const isFollow = await Follow.findOne({
      follower: req.user._id,
      following: user._id,
    });

    if (isFollow) {
      isFollowing = true;
    }
  }

  const postsCount = await Blog.countDocuments({
    userId: user._id,
    isPublic: true,
    isDraft: false,
  });

  const data = {
    ...user._doc,
    followers: followersCount,
    following: followingCount,
    isFollowing,
    posts: postsCount,
  };

  const response = new ApiResponse(200, data, "User fetched successfully");
  return res.status(response.statusCode).json(response);
});

export const getUserPost = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const blogs = await Blog.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $addFields: {
        user: { $first: "$user" },
      },
    },
    {
      $addFields: {
        username: "$user.username",
      },
    },
    {
      $match: {
        username,
        isPublic: true,
        isDraft: false,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "author",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              email: 1,
              _id: 1,
              name: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        author: { $first: "$author" },
      },
    },
    {
      $lookup: {
        from: "tags",
        localField: "tags",
        foreignField: "_id",
        as: "tags",
        pipeline: [{ $project: { name: 1, slug: 1 } }],
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
        pipeline: [{ $project: { name: 1, slug: 1 } }],
      },
    },
    {
      $addFields: {
        category: { $first: "$category" },
      },
    },
    {
      $project: {
        userId: 0,
        __v: 0,
        user: 0,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  const response = new ApiResponse(
    200,
    blogs,
    "User posts fetched successfully"
  );
  return res.status(response.statusCode).json(response);
});

export const followUser = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const loggedInUser = req.user;

  const followedUser = await User.findOne({ username });

  if (!followedUser) {
    throw new ApiError(404, "User not found");
  }

  if (followedUser.username === loggedInUser.username) {
    throw new ApiError(400, "You can't follow yourself");
  }

  const isAlreadyFollowing = await Follow.findOne({
    follower: loggedInUser._id,
    following: followedUser._id,
  });

  if (isAlreadyFollowing) {
    throw new ApiError(400, "You already follow this user");
  }

  const follow = await Follow.create({
    follower: loggedInUser._id,
    following: followedUser._id,
  });

  const response = new ApiResponse(201, follow, "User followed successfully");
  return res.status(response.statusCode).json(response);
});

export const unfollowUser = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const loggedInUser = req.user;

  const followedUser = await User.findOne({ username });

  if (!followedUser) {
    throw new ApiError(404, "User not found");
  }

  if (followedUser.username === loggedInUser.username) {
    throw new ApiError(400, "You can't unfollow yourself");
  }

  const isFollowing = await Follow.findOne({
    follower: loggedInUser._id,
    following: followedUser._id,
  });

  if (!isFollowing) {
    throw new ApiError(400, "You don't follow this user");
  }

  await Follow.findByIdAndDelete(isFollowing._id);

  const response = new ApiResponse(200, {}, "User unfollowed successfully");
  return res.status(response.statusCode).json(response);
});

// GET /:username/followers - list of users who follow this user
export const getFollowersList = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });
  if (!user) throw new ApiError(404, "User not found");

  const followers = await Follow.aggregate([
    {
      $match: { following: new mongoose.Types.ObjectId(user._id) },
    },
    {
      $lookup: {
        from: "users",
        localField: "follower",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              name: 1,
              username: 1,
              avatar: 1,
              bio: 1,
            },
          },
        ],
      },
    },
    { $addFields: { user: { $first: "$user" } } },
    { $replaceRoot: { newRoot: "$user" } },
    { $sort: { username: 1 } },
  ]);

  const response = new ApiResponse(
    200,
    followers,
    "Followers list fetched successfully"
  );
  return res.status(response.statusCode).json(response);
});

// GET /:username/following - list of users this user follows
export const getFollowingList = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username });
  if (!user) throw new ApiError(404, "User not found");

  const following = await Follow.aggregate([
    {
      $match: { follower: new mongoose.Types.ObjectId(user._id) },
    },
    {
      $lookup: {
        from: "users",
        localField: "following",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              name: 1,
              username: 1,
              avatar: 1,
              bio: 1,
            },
          },
        ],
      },
    },
    { $addFields: { user: { $first: "$user" } } },
    { $replaceRoot: { newRoot: "$user" } },
    { $sort: { username: 1 } },
  ]);

  const response = new ApiResponse(
    200,
    following,
    "Following list fetched successfully"
  );
  return res.status(response.statusCode).json(response);
});

// GET /:username/stats - follower count + following count + post count
export const getUserStats = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).select(
    "_id username name avatar bio"
  );
  if (!user) throw new ApiError(404, "User not found");

  const [followersCount, followingCount, postsCount] = await Promise.all([
    Follow.countDocuments({ following: user._id }),
    Follow.countDocuments({ follower: user._id }),
    Blog.countDocuments({ userId: user._id, isPublic: true, isDraft: false }),
  ]);

  const response = new ApiResponse(
    200,
    {
      _id: user._id,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      followers: followersCount,
      following: followingCount,
      posts: postsCount,
    },
    "User stats fetched successfully"
  );
  return res.status(response.statusCode).json(response);
});

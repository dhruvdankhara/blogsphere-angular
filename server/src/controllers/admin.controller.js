import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import Blog from "../models/blog.model.js";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import Follow from "../models/follow.model.js";
import Bookmark from "../models/bookmark.model.js";
import Report from "../models/report.model.js";
import { AvailableUserRoles } from "../constants.js";
import { deleteImage } from "../utils/cloudinary.js";

// GET /api/v1/admin/users - list all users with optional search
export const getAllUsers = asyncHandler(async (req, res) => {
  const { search, role, page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const matchStage = {};
  if (role) matchStage.role = role;
  if (search) {
    matchStage.$or = [
      { name: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(matchStage)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    User.countDocuments(matchStage),
  ]);

  const response = new ApiResponse(
    200,
    { users, total, page: parseInt(page), limit: parseInt(limit) },
    "Users fetched successfully"
  );
  return res.status(response.statusCode).json(response);
});

// GET /api/v1/admin/users/:userId - get single user by id
export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select("-password");
  if (!user) throw new ApiError(404, "User not found");

  const [followersCount, followingCount, postsCount] = await Promise.all([
    Follow.countDocuments({ following: user._id }),
    Follow.countDocuments({ follower: user._id }),
    Blog.countDocuments({ userId: user._id }),
  ]);

  const response = new ApiResponse(
    200,
    {
      ...user._doc,
      followers: followersCount,
      following: followingCount,
      posts: postsCount,
    },
    "User fetched successfully"
  );
  return res.status(response.statusCode).json(response);
});

// PATCH /api/v1/admin/users/:userId/role - change user role
export const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!role || !AvailableUserRoles.includes(role)) {
    throw new ApiError(400, `Valid roles: ${AvailableUserRoles.join(", ")}`);
  }

  // prevent admin from changing their own role
  if (userId === req.user._id.toString()) {
    throw new ApiError(400, "You cannot change your own role");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  ).select("-password");

  if (!user) throw new ApiError(404, "User not found");

  const response = new ApiResponse(200, user, "User role updated successfully");
  return res.status(response.statusCode).json(response);
});

// DELETE /api/v1/admin/users/:userId - delete a user and all their data
export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (userId === req.user._id.toString()) {
    throw new ApiError(
      400,
      "You cannot delete your own account from admin panel"
    );
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  // delete all blogs by this user and cascade
  const blogs = await Blog.find({ userId: user._id });
  for (const blog of blogs) {
    if (blog.featureImage) {
      const publicId = blog.featureImage
        .substring(blog.featureImage.lastIndexOf("/") + 1)
        .split(".")[0];
      await deleteImage(publicId);
    }
    await Comment.deleteMany({ blogId: blog._id });
    await Like.deleteMany({ blogId: blog._id });
    await Bookmark.deleteMany({ blogId: blog._id });
    await Report.deleteMany({ blogId: blog._id });
  }
  await Blog.deleteMany({ userId: user._id });

  // remove follow relationships
  await Follow.deleteMany({
    $or: [{ follower: user._id }, { following: user._id }],
  });

  // remove bookmarks by user
  await Bookmark.deleteMany({ userId: user._id });

  // remove comments by user
  await Comment.deleteMany({ userId: user._id });

  // remove likes by user
  await Like.deleteMany({ userId: user._id });

  // remove reports by user
  await Report.deleteMany({ reportedBy: user._id });

  await User.findByIdAndDelete(userId);

  const response = new ApiResponse(200, null, "User deleted successfully");
  return res.status(response.statusCode).json(response);
});

// GET /api/v1/admin/blogs - list all blogs including private/draft
export const getAllBlogsAdmin = asyncHandler(async (req, res) => {
  const { search, isDraft, isPublic, page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const matchStage = {};
  if (isDraft !== undefined) matchStage.isDraft = isDraft === "true";
  if (isPublic !== undefined) matchStage.isPublic = isPublic === "true";
  if (search) {
    matchStage.$or = [
      { title: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
    ];
  }

  const [blogs, total] = await Promise.all([
    Blog.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "author",
          pipeline: [
            { $project: { name: 1, username: 1, avatar: 1, email: 1 } },
          ],
        },
      },
      { $addFields: { author: { $first: "$author" } } },
      { $project: { userId: 0, __v: 0, content: 0 } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
    ]),
    Blog.countDocuments(matchStage),
  ]);

  const response = new ApiResponse(
    200,
    { blogs, total, page: parseInt(page), limit: parseInt(limit) },
    "Blogs fetched successfully"
  );
  return res.status(response.statusCode).json(response);
});

// DELETE /api/v1/admin/blogs/:blogId - admin force delete any blog
export const deleteBlogAdmin = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findOne({ slug: blogId });
  if (!blog) throw new ApiError(404, "Blog post not found");

  if (blog.featureImage) {
    await deleteImage(
      blog.featureImage
        .substring(blog.featureImage.lastIndexOf("/") + 1)
        .split(".")[0]
    );
  }

  await Blog.findByIdAndDelete(blog._id);
  await Comment.deleteMany({ blogId: blog._id });
  await Like.deleteMany({ blogId: blog._id });
  await Bookmark.deleteMany({ blogId: blog._id });
  await Report.deleteMany({ blogId: blog._id });

  const response = new ApiResponse(200, null, "Blog post deleted successfully");
  return res.status(response.statusCode).json(response);
});

// GET /api/v1/admin/dashboard - platform-wide stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    totalComments,
    totalLikes,
    totalReports,
    pendingReports,
  ] = await Promise.all([
    User.countDocuments(),
    Blog.countDocuments(),
    Blog.countDocuments({ isPublic: true, isDraft: false }),
    Blog.countDocuments({ isDraft: true }),
    Comment.countDocuments(),
    Like.countDocuments(),
    Report.countDocuments(),
    Report.countDocuments({ status: "PENDING" }),
  ]);

  const response = new ApiResponse(
    200,
    {
      totalUsers,
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalComments,
      totalLikes,
      totalReports,
      pendingReports,
    },
    "Dashboard stats fetched successfully"
  );
  return res.status(response.statusCode).json(response);
});

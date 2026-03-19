import Bookmark from "../models/bookmark.model.js";
import Blog from "../models/blog.model.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// POST /api/v1/bookmark/:blogId - add bookmark
export const addBookmark = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findById(blogId);
  if (!blog) throw new ApiError(404, "Blog post not found");

  const existing = await Bookmark.findOne({
    userId: req.user._id,
    blogId: blog._id,
  });
  if (existing) throw new ApiError(400, "Blog post already bookmarked");

  const bookmark = await Bookmark.create({
    userId: req.user._id,
    blogId: blog._id,
  });

  const response = new ApiResponse(
    201,
    bookmark,
    "Blog post bookmarked successfully"
  );
  return res.status(response.statusCode).json(response);
});

// DELETE /api/v1/bookmark/:blogId - remove bookmark
export const removeBookmark = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findById(blogId);
  if (!blog) throw new ApiError(404, "Blog post not found");

  const bookmark = await Bookmark.findOneAndDelete({
    userId: req.user._id,
    blogId: blog._id,
  });

  if (!bookmark) throw new ApiError(400, "Blog post is not bookmarked");

  const response = new ApiResponse(200, null, "Bookmark removed successfully");
  return res.status(response.statusCode).json(response);
});

// GET /api/v1/bookmark - get all bookmarks of logged-in user
export const getMyBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await Bookmark.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "blogs",
        localField: "blogId",
        foreignField: "_id",
        as: "blog",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "author",
              pipeline: [
                {
                  $project: { username: 1, avatar: 1, name: 1, _id: 1 },
                },
              ],
            },
          },
          {
            $addFields: { author: { $first: "$author" } },
          },
          {
            $project: { userId: 0, __v: 0 },
          },
        ],
      },
    },
    {
      $addFields: { blog: { $first: "$blog" } },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  const response = new ApiResponse(
    200,
    bookmarks,
    "Bookmarks fetched successfully"
  );
  return res.status(response.statusCode).json(response);
});

// GET /api/v1/bookmark/:blogId/status - check if a blog is bookmarked
export const getBookmarkStatus = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const bookmark = await Bookmark.findOne({
    userId: req.user._id,
    blogId,
  });

  const response = new ApiResponse(
    200,
    { isBookmarked: !!bookmark },
    "Bookmark status fetched"
  );
  return res.status(response.statusCode).json(response);
});

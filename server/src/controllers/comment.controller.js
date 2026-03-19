import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Comment from "../models/comment.model.js";
import Blog from "../models/blog.model.js";

const authorLookupStages = [
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "author",
      pipeline: [
        {
          $project: {
            password: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
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
    $sort: { createdAt: -1 },
  },
  {
    $project: { __v: 0 },
  },
];

// POST /:blogId/comment - create a top-level comment
export const createComment = asyncHandler(async (req, res) => {
  const user = req.user;
  const { blogId } = req.params;
  const { content } = req.body;

  const blogPost = await Blog.findById(blogId);

  if (!blogPost) {
    throw new ApiError(404, "Blog post not found");
  }

  const comment = await Comment.create({
    content,
    userId: user._id,
    blogId: blogPost._id,
    parentComment: null,
  });

  if (!comment) {
    throw new ApiError(500, "Failed to create comment.");
  }

  const response = new ApiResponse(201, comment, "Comment added successfully.");
  return res.status(response.statusCode).json(response);
});

// GET /:blogId/comment - get top-level comments for a blog (with reply count)
export const getBlogComments = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const comments = await Comment.aggregate([
    {
      $match: {
        blogId: new mongoose.Types.ObjectId(blogId),
        parentComment: null,
      },
    },
    ...authorLookupStages.slice(0, -2), // lookup + addFields only
    {
      // count replies for each top-level comment
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "parentComment",
        as: "replies",
      },
    },
    {
      $addFields: {
        replyCount: { $size: "$replies" },
      },
    },
    {
      $project: {
        __v: 0,
        replies: 0,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  if (comments.length === 0) {
    const response = new ApiResponse(200, [], "No comments found on this post");
    return res.status(response.statusCode).json(response);
  }

  const response = new ApiResponse(200, comments, "Comments found.");
  return res.status(response.statusCode).json(response);
});

// POST /:blogId/comment/:commentId/reply - reply to a comment
export const replyToComment = asyncHandler(async (req, res) => {
  const user = req.user;
  const { blogId, commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Reply content is required");
  }

  const blogPost = await Blog.findById(blogId);
  if (!blogPost) throw new ApiError(404, "Blog post not found");

  const parentComment = await Comment.findById(commentId);
  if (!parentComment) throw new ApiError(404, "Comment not found");

  // only allow one level of nesting: reply must target a top-level comment
  if (parentComment.parentComment !== null) {
    throw new ApiError(
      400,
      "Cannot reply to a reply. Reply to the top-level comment instead."
    );
  }

  const reply = await Comment.create({
    content,
    userId: user._id,
    blogId: blogPost._id,
    parentComment: parentComment._id,
  });

  if (!reply) {
    throw new ApiError(500, "Failed to create reply.");
  }

  const response = new ApiResponse(201, reply, "Reply added successfully.");
  return res.status(response.statusCode).json(response);
});

// GET /:blogId/comment/:commentId/reply - get all replies for a comment
export const getCommentReplies = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const replies = await Comment.aggregate([
    {
      $match: {
        parentComment: new mongoose.Types.ObjectId(commentId),
      },
    },
    ...authorLookupStages,
  ]);

  const response = new ApiResponse(
    200,
    replies,
    "Replies fetched successfully."
  );
  return res.status(response.statusCode).json(response);
});

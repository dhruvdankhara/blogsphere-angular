import mongoose from "mongoose";
import Blog from "../models/blog.model.js";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import Bookmark from "../models/bookmark.model.js";
import Report from "../models/report.model.js";
import Tag from "../models/tag.model.js";
import { createBlogPostSchema } from "../schemas/blog.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { deleteImage, uploadImage } from "../utils/cloudinary.js";
import { generateBlogImageFromTitle } from "../utils/helper.js";

// Shared aggregation stages: author + tags + category population
const blogLookupStages = [
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
      pipeline: [{ $project: { name: 1, slug: 1, featureImage: 1 } }],
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
    },
  },
];

// helper: parse tags from string or array
const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  try {
    return JSON.parse(tags);
  } catch {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
};

// helper: resolve an array of tag names to ObjectId refs (find-or-create)
const resolveTagNames = async (tagNames) => {
  if (!tagNames || !tagNames.length) return [];
  const ids = [];
  for (const raw of tagNames) {
    const name = raw
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    if (!name) continue;
    const slug = name;
    let tag = await Tag.findOne({ name });
    if (!tag) {
      tag = await Tag.create({ name, slug });
    }
    ids.push(tag._id);
  }
  return ids;
};

export const createBlogPost = asyncHandler(async (req, res) => {
  const user = req.user;
  const file = req.file;
  const { title, content, slug, featureImageUrl, isPublic, isDraft } = req.body;
  const rawTags = parseTags(req.body.tags);
  const { category } = req.body;

  await createBlogPostSchema.validate({ title, content, slug });

  const existingBlog = await Blog.findOne({ slug });
  if (existingBlog) {
    throw new ApiError(400, "Blog post with this slug already exists");
  }

  // Resolve tag names to ObjectIds (find or create)
  const tags = await resolveTagNames(rawTags);

  let imageUrl = "";
  if (file) {
    imageUrl = await uploadImage(file.path);
  } else if (featureImageUrl) {
    imageUrl = { secure_url: featureImageUrl };
  }

  const blog = await Blog.create({
    userId: user._id,
    title,
    content,
    slug,
    featureImage: imageUrl?.secure_url || "",
    tags,
    category: category || null,
    isPublic:
      isPublic !== undefined ? isPublic === "true" || isPublic === true : true,
    isDraft:
      isDraft !== undefined ? isDraft === "true" || isDraft === true : false,
  });

  if (!blog) {
    throw new ApiError(500, "Failed to create blog post");
  }

  const response = new ApiResponse(201, blog, "Blog post created successfully");
  return res.status(response.statusCode).json(response);
});

export const deleteBlogPost = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findOne({ slug: blogId });

  if (!blog) {
    throw new ApiError(404, "Blog post not found");
  }

  const isOwner = blog.userId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You are not authorized to delete this blog post");
  }

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

export const editBlogPost = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { title, content, slug, featureImageUrl, isPublic, isDraft } = req.body;
  const { category } = req.body;
  const file = req.file;

  const blog = await Blog.findOne({ slug: blogId });

  if (!blog) {
    throw new ApiError(404, "Blog post not found");
  }

  if (blog.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to edit this blog post");
  }

  if (slug && slug !== blog.slug) {
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      throw new ApiError(400, "Blog post with this slug already exists");
    }
  }

  if (file) {
    const cloudinaryResponse = await uploadImage(file.path);
    blog.featureImage = cloudinaryResponse.secure_url;
  } else if (featureImageUrl) {
    blog.featureImage = featureImageUrl;
  }

  if (title) blog.title = title;
  if (content) blog.content = content;
  if (slug) blog.slug = slug;
  if (isPublic !== undefined)
    blog.isPublic = isPublic === "true" || isPublic === true;
  if (isDraft !== undefined)
    blog.isDraft = isDraft === "true" || isDraft === true;
  if (category !== undefined) blog.category = category || null;

  if (req.body.tags !== undefined) {
    const rawTags = parseTags(req.body.tags);
    blog.tags = await resolveTagNames(rawTags);
  }

  await blog.save();

  const response = new ApiResponse(200, blog, "Blog post updated successfully");
  return res.status(response.statusCode).json(response);
});

export const getBlogPost = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.aggregate([
    { $match: { slug: blogId } },
    ...blogLookupStages,
  ]);

  if (blog.length === 0) {
    throw new ApiError(404, "Blog post not found");
  }

  const post = blog[0];

  const isOwner =
    req.user && req.user._id.toString() === post.author?._id?.toString();
  const isAdmin = req.user && req.user.role === "ADMIN";

  if ((!post.isPublic || post.isDraft) && !isOwner && !isAdmin) {
    throw new ApiError(404, "Blog post not found");
  }

  await Blog.updateOne({ _id: post._id }, { visits: post.visits + 1 });

  let isLiked = false;
  let isBookmarked = false;

  if (req.user) {
    const like = await Like.findOne({ userId: req.user._id, blogId: post._id });
    if (like) isLiked = true;

    const bookmark = await Bookmark.findOne({
      userId: req.user._id,
      blogId: post._id,
    });
    if (bookmark) isBookmarked = true;
  }

  const likes = await Like.countDocuments({ blogId: post._id });
  const comments = await Comment.countDocuments({
    blogId: post._id,
    parentComment: null,
  });

  const response = new ApiResponse(
    200,
    { ...post, isLiked, isBookmarked, likes, comments },
    "Blog post retrieved successfully"
  );

  return res.status(response.statusCode).json(response);
});

export const getAllBlogPosts = asyncHandler(async (req, res) => {
  const { category, tag } = req.query;

  const blog = await Blog.aggregate([
    { $match: { isPublic: true, isDraft: false } },
    ...blogLookupStages,
    ...(category ? [{ $match: { "category.slug": category } }] : []),
    ...(tag ? [{ $match: { "tags.slug": tag } }] : []),
    { $sort: { createdAt: -1 } },
  ]);

  const response = new ApiResponse(
    200,
    blog,
    "Blog posts retrieved successfully"
  );
  return res.status(response.statusCode).json(response);
});

export const likeBlogPost = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog post not found");
  }

  const isAlreadyLiked = await Like.findOne({
    userId: req.user._id,
    blogId: blog._id,
  });

  if (isAlreadyLiked) {
    throw new ApiError(400, "You have already liked this blog post");
  }

  await Like.create({
    userId: req.user._id,
    blogId: blog._id,
  });

  const response = new ApiResponse(200, null, "Blog post liked successfully");
  return res.status(response.statusCode).json(response);
});

export const unlikeBlogPost = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(404, "Blog post not found");
  }

  const isAlreadyLiked = await Like.findOne({
    userId: req.user._id,
    blogId: blog._id,
  });

  if (!isAlreadyLiked) {
    throw new ApiError(400, "You have not liked this blog post");
  }

  await Like.findOneAndDelete({
    userId: req.user._id,
    blogId: blog._id,
  });

  const response = new ApiResponse(200, null, "Blog post unliked successfully");
  return res.status(response.statusCode).json(response);
});

export const searchBlogPosts = asyncHandler(async (req, res) => {
  const { searchQuery } = req.params;

  const blog = await Blog.aggregate([
    {
      $match: {
        isPublic: true,
        isDraft: false,
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { content: { $regex: searchQuery, $options: "i" } },
        ],
      },
    },
    ...blogLookupStages,
    { $sort: { createdAt: -1 } },
  ]);

  const response = new ApiResponse(
    200,
    blog,
    "Search results retrieved successfully"
  );
  return res.status(response.statusCode).json(response);
});

export const generateBlogImage = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required to generate blog image");
  }

  const results = await generateBlogImageFromTitle(title);

  const response = new ApiResponse(
    200,
    { imageUrl: results },
    "Blog image generated successfully"
  );
  return res.status(response.statusCode).json(response);
});

// GET /api/v1/blog/my-drafts - logged-in user's drafts
export const getMyDrafts = asyncHandler(async (req, res) => {
  const drafts = await Blog.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(req.user._id),
        isDraft: true,
      },
    },
    ...blogLookupStages,
    { $sort: { updatedAt: -1 } },
  ]);

  const response = new ApiResponse(
    200,
    drafts,
    "Draft posts fetched successfully"
  );
  return res.status(response.statusCode).json(response);
});

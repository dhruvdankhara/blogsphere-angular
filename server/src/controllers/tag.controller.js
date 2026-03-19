import Tag from "../models/tag.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// GET /api/v1/tags - list all tags
export const getAllTags = asyncHandler(async (req, res) => {
  const tags = await Tag.find().sort({ name: 1 });
  const response = new ApiResponse(200, tags, "Tags fetched successfully");
  return res.status(response.statusCode).json(response);
});

// GET /api/v1/tags/search?q=term - search tags by name
export const searchTags = asyncHandler(async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No query provided"));
  }
  const tags = await Tag.find({
    name: { $regex: q, $options: "i" },
  })
    .sort({ name: 1 })
    .limit(10);
  const response = new ApiResponse(200, tags, "Tags searched successfully");
  return res.status(response.statusCode).json(response);
});

// POST /api/v1/tags/find-or-create - find existing tag or create new one
export const findOrCreateTag = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    throw new ApiError(400, "Tag name is required");
  }

  const normalised = name.trim().toLowerCase();
  const slug = normalised.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  let tag = await Tag.findOne({ name: normalised });
  if (!tag) {
    tag = await Tag.create({ name: normalised, slug });
  }

  const response = new ApiResponse(200, tag, "Tag ready");
  return res.status(response.statusCode).json(response);
});

// GET /api/v1/tags/:tagId - get single tag
export const getTagById = asyncHandler(async (req, res) => {
  const { tagId } = req.params;
  const tag = await Tag.findById(tagId);
  if (!tag) throw new ApiError(404, "Tag not found");
  const response = new ApiResponse(200, tag, "Tag fetched successfully");
  return res.status(response.statusCode).json(response);
});

// POST /api/v1/tags - create tag (admin only)
export const createTag = asyncHandler(async (req, res) => {
  const { name, slug } = req.body;

  if (!name || !slug) {
    throw new ApiError(400, "Name and slug are required");
  }

  const existing = await Tag.findOne({
    $or: [{ name: name.toLowerCase() }, { slug: slug.toLowerCase() }],
  });
  if (existing) {
    throw new ApiError(400, "Tag with this name or slug already exists");
  }

  const tag = await Tag.create({
    name: name.toLowerCase(),
    slug: slug.toLowerCase(),
  });
  const response = new ApiResponse(201, tag, "Tag created successfully");
  return res.status(response.statusCode).json(response);
});

// PATCH /api/v1/tags/:tagId - update tag (admin only)
export const updateTag = asyncHandler(async (req, res) => {
  const { tagId } = req.params;
  const { name, slug } = req.body;

  const tag = await Tag.findById(tagId);
  if (!tag) throw new ApiError(404, "Tag not found");

  if (name) tag.name = name.toLowerCase();
  if (slug) tag.slug = slug.toLowerCase();

  await tag.save();
  const response = new ApiResponse(200, tag, "Tag updated successfully");
  return res.status(response.statusCode).json(response);
});

// DELETE /api/v1/tags/:tagId - delete tag (admin only)
export const deleteTag = asyncHandler(async (req, res) => {
  const { tagId } = req.params;
  const tag = await Tag.findByIdAndDelete(tagId);
  if (!tag) throw new ApiError(404, "Tag not found");
  const response = new ApiResponse(200, null, "Tag deleted successfully");
  return res.status(response.statusCode).json(response);
});

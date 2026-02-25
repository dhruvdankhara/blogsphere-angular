import Category from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { deleteImage, uploadImage } from "../utils/cloudinary.js";

// GET /api/v1/category - list all categories
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find()
    .populate("createdBy", "name username avatar")
    .sort({ name: 1 });
  const response = new ApiResponse(
    200,
    categories,
    "Categories fetched successfully"
  );
  return res.status(response.statusCode).json(response);
});

// GET /api/v1/category/:categoryId - get single category
export const getCategoryById = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const category = await Category.findById(categoryId).populate(
    "createdBy",
    "name username avatar"
  );
  if (!category) throw new ApiError(404, "Category not found");
  const response = new ApiResponse(
    200,
    category,
    "Category fetched successfully"
  );
  return res.status(response.statusCode).json(response);
});

// POST /api/v1/category - create category (admin only)
export const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description } = req.body;
  const file = req.file;

  if (!name || !slug) {
    throw new ApiError(400, "Name and slug are required");
  }

  const existing = await Category.findOne({
    $or: [{ name }, { slug: slug.toLowerCase() }],
  });
  if (existing) {
    throw new ApiError(400, "Category with this name or slug already exists");
  }

  let featureImage = "";
  if (file) {
    const uploaded = await uploadImage(file.path);
    featureImage = uploaded?.secure_url || "";
  }

  const category = await Category.create({
    name,
    slug: slug.toLowerCase(),
    description: description || "",
    featureImage,
    createdBy: req.user._id,
  });

  const response = new ApiResponse(
    201,
    category,
    "Category created successfully"
  );
  return res.status(response.statusCode).json(response);
});

// PATCH /api/v1/category/:categoryId - update category (admin only)
export const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name, slug, description } = req.body;
  const file = req.file;

  const category = await Category.findById(categoryId);
  if (!category) throw new ApiError(404, "Category not found");

  if (name) category.name = name;
  if (slug) category.slug = slug.toLowerCase();
  if (description !== undefined) category.description = description;

  if (file) {
    if (category.featureImage) {
      const publicId = category.featureImage
        .substring(category.featureImage.lastIndexOf("/") + 1)
        .split(".")[0];
      await deleteImage(publicId);
    }
    const uploaded = await uploadImage(file.path);
    category.featureImage = uploaded?.secure_url || "";
  }

  await category.save();
  const response = new ApiResponse(
    200,
    category,
    "Category updated successfully"
  );
  return res.status(response.statusCode).json(response);
});

// DELETE /api/v1/category/:categoryId - delete category (admin only)
export const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const category = await Category.findById(categoryId);
  if (!category) throw new ApiError(404, "Category not found");

  if (category.featureImage) {
    const publicId = category.featureImage
      .substring(category.featureImage.lastIndexOf("/") + 1)
      .split(".")[0];
    await deleteImage(publicId);
  }

  await Category.findByIdAndDelete(categoryId);
  const response = new ApiResponse(200, null, "Category deleted successfully");
  return res.status(response.statusCode).json(response);
});

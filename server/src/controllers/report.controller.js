import Report from "../models/report.model.js";
import Blog from "../models/blog.model.js";
import mongoose from "mongoose";
import { AvailableReportReasons, ReportStatusEnum } from "../constants.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// POST /api/v1/report/:blogId - report a blog post
export const reportBlogPost = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { reason, description } = req.body;

  if (!reason || !AvailableReportReasons.includes(reason)) {
    throw new ApiError(
      400,
      `Reason is required. Valid reasons: ${AvailableReportReasons.join(", ")}`
    );
  }

  const blog = await Blog.findById(blogId);
  if (!blog) throw new ApiError(404, "Blog post not found");

  const existing = await Report.findOne({
    reportedBy: req.user._id,
    blogId: blog._id,
  });
  if (existing)
    throw new ApiError(400, "You have already reported this blog post");

  const report = await Report.create({
    reportedBy: req.user._id,
    blogId: blog._id,
    reason,
    description: description || "",
  });

  const response = new ApiResponse(
    201,
    report,
    "Blog post reported successfully"
  );
  return res.status(response.statusCode).json(response);
});

// GET /api/v1/report - get all reports (admin only)
export const getAllReports = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const matchStage = {};
  if (status) matchStage.status = status;

  const reports = await Report.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "users",
        localField: "reportedBy",
        foreignField: "_id",
        as: "reportedBy",
        pipeline: [{ $project: { username: 1, avatar: 1, name: 1, email: 1 } }],
      },
    },
    { $addFields: { reportedBy: { $first: "$reportedBy" } } },
    {
      $lookup: {
        from: "blogs",
        localField: "blogId",
        foreignField: "_id",
        as: "blog",
        pipeline: [{ $project: { title: 1, slug: 1 } }],
      },
    },
    { $addFields: { blog: { $first: "$blog" } } },
    {
      $lookup: {
        from: "users",
        localField: "reviewedBy",
        foreignField: "_id",
        as: "reviewedBy",
        pipeline: [{ $project: { username: 1, name: 1 } }],
      },
    },
    { $addFields: { reviewedBy: { $first: "$reviewedBy" } } },
    { $sort: { createdAt: -1 } },
  ]);

  const response = new ApiResponse(
    200,
    reports,
    "Reports fetched successfully"
  );
  return res.status(response.statusCode).json(response);
});

// PATCH /api/v1/report/:reportId/status - update report status (admin only)
export const updateReportStatus = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const { status } = req.body;

  const validStatuses = Object.values(ReportStatusEnum);
  if (!status || !validStatuses.includes(status)) {
    throw new ApiError(400, `Valid statuses: ${validStatuses.join(", ")}`);
  }

  const report = await Report.findById(reportId);
  if (!report) throw new ApiError(404, "Report not found");

  report.status = status;
  report.reviewedBy = req.user._id;
  await report.save();

  const response = new ApiResponse(
    200,
    report,
    "Report status updated successfully"
  );
  return res.status(response.statusCode).json(response);
});

// DELETE /api/v1/report/:reportId - delete a report (admin only)
export const deleteReport = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const report = await Report.findByIdAndDelete(reportId);
  if (!report) throw new ApiError(404, "Report not found");
  const response = new ApiResponse(200, null, "Report deleted successfully");
  return res.status(response.statusCode).json(response);
});

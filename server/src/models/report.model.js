import { Schema, model } from "mongoose";
import {
  AvailableReportReasons,
  AvailableReportStatuses,
  ReportReasonEnum,
  ReportStatusEnum,
} from "../constants.js";

const reportSchema = new Schema(
  {
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    reason: {
      type: String,
      enum: AvailableReportReasons,
      default: ReportReasonEnum.OTHER,
      required: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: AvailableReportStatuses,
      default: ReportStatusEnum.PENDING,
    },
    // admin who reviewed the report
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

// one user can only report a specific blog once
reportSchema.index({ reportedBy: 1, blogId: 1 }, { unique: true });

const Report = model("Report", reportSchema);

export default Report;

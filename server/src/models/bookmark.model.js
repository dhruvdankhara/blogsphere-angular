import { Schema, model } from "mongoose";

const bookmarkSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
  },
  { timestamps: true }
);

// one user can only bookmark a specific blog once
bookmarkSchema.index({ userId: 1, blogId: 1 }, { unique: true });

const Bookmark = model("Bookmark", bookmarkSchema);

export default Bookmark;

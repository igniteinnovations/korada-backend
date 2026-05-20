import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    newsId: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    content: {
      type: String,
      required: true,
    },

    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },

    mediaUrl: {
      type: String,
      default: "",
    },

    // ✅ CUSTOM CATEGORY ID
    categoryId: {
      type: String,
      required: true,
    },

    categoryName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const News = mongoose.model("News", newsSchema);

export default News;

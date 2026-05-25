import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    newsId: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      english: {
        type: String,
        required: true,
        trim: true,
      },

      telugu: {
        type: String,
        required: true,
        trim: true,
      },
    },

    slug: {
      english: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },

      telugu: {
        type: String,
        required: true,
        lowercase: true,
      },
    },

    content: {
      english: {
        type: String,
        required: true,
      },

      telugu: {
        type: String,
        required: true,
      },
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
    isAutoTranslated: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  },
);

const News = mongoose.model("News", newsSchema);

export default News;

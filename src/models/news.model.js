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

      lowercase: true,
    },

    content: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      enum: ["english", "telugu"],
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

    categoryId: {
      type: String,
      required: true,
    },

    categoryName: {
      type: String,
      required: true,
    },
    styles: {
      titleFontSize: {
        type: String,
        default: "32px",
      },

      contentFontSize: {
        type: String,
        default: "18px",
      },

      fontFamily: {
        type: String,
        default: "Arial",
      },

      titleColor: {
        type: String,
        default: "#000000",
      },

      contentColor: {
        type: String,
        default: "#333333",
      },

      isBold: {
        type: Boolean,
        default: false,
      },

      isItalic: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  },
);
newsSchema.index({ slug: 1, language: 1 }, { unique: true });
const News = mongoose.model("News", newsSchema);

export default News;

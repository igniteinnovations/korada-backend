import mongoose from "mongoose";

const articleViewSchema = new mongoose.Schema(
  {
    viewId: {
      type: String,
      required: true,
      unique: true,
    },

    articleId: {
      type: String,
      required: true,
      index: true,
    },

    articleSlug: {
      type: String,
      required: true,
    },

    sessionId: {
      type: String,
      default: null,
      index: true,
    },

    device: {
      type: String,
      enum: ["web", "mobile", "tablet", "desktop", "unknown"],
      default: "web",
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
articleViewSchema.index({
  articleId: 1,
  createdAt: -1,
});

const ArticleView = mongoose.model("ArticleView", articleViewSchema);

export default ArticleView;

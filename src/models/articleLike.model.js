import mongoose from "mongoose";

const articleLikeSchema = new mongoose.Schema(
  {
    likeId: {
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
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate likes
articleLikeSchema.index(
  {
    articleId: 1,
    sessionId: 1,
  },
  {
    unique: true,
  },
);

const ArticleLike = mongoose.model("ArticleLike", articleLikeSchema);

export default ArticleLike;

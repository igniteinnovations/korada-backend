import mongoose from "mongoose";

const articleCommentSchema = new mongoose.Schema(
  {
    commentId: {
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

    userName: {
      type: String,
      default: "Anonymous",
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
articleCommentSchema.index({
  articleId: 1,
  createdAt: -1,
});

const ArticleComment = mongoose.model("ArticleComment", articleCommentSchema);

export default ArticleComment;

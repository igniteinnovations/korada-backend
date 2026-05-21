import mongoose from "mongoose";

const articleShareSchema = new mongoose.Schema(
  {
    shareId: {
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

    platform: {
      type: String,

      enum: [
        "twitter",
        "facebook",
        "whatsapp",
        "linkedin",
        "telegram",
        "other",
      ],

      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
articleShareSchema.index({
  articleId: 1,
  createdAt: -1,
});

const ArticleShare = mongoose.model("ArticleShare", articleShareSchema);

export default ArticleShare;

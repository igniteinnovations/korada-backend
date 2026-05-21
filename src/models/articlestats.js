import mongoose from "mongoose";

const analyticsStatSchema = new mongoose.Schema(
  {
    articleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
    articleSlug: {
      type: String,
      required: true,
    },

    totalViews: {
      type: Number,
      default: 0,
    },

    totalShares: {
      type: Number,
      default: 0,
    },

    totalComments: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const AnalyticsStat = mongoose.model("AnalyticsStat", analyticsStatSchema);

export default AnalyticsStat;

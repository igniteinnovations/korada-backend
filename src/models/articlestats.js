import mongoose from "mongoose";

const analyticsStatSchema = new mongoose.Schema(
  {
    articleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    articleSlug: {
      type: String,
      required: true,
    },

    // 👁 Total Views
    totalViews: {
      type: Number,
      default: 0,
    },

    // ⏱ Total Time Spent By All Users (seconds)
    totalSessionTime: {
      type: Number,
      default: 0,
    },

    // ⏱ Average Reading Time
    averageSessionTime: {
      type: Number,
      default: 0,
    },
    // 🧠 Total Sessions
    totalSessions: {
      type: Number,
      default: 0,
    },

    // 🚪 Bounce Users
    bounceCount: {
      type: Number,
      default: 0,
    },

    // 📉 Bounce Percentage
    bounceRate: {
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

import express from "express";

import auth from "../middleware/auth.js";

import {
  trackView,
  toggleLike,
  trackShare,
  trackComment,
  getArticleStats,
  getTrendingArticles,
} from "../controllers/analytics.controller.js";

const router = express.Router();

// ========================================
// PUBLIC TRACKING ROUTES
// ========================================

// Track View
router.post("/track/view", trackView);

// Track Share
router.post("/track/share", trackShare);

// Track Comment
router.post("/track/comment", trackComment);
//like
router.post("/track/like", toggleLike);

// ========================================
// PUBLIC ANALYTICS ROUTES
// ========================================

// Get article analytics
router.get("/article/:articleId", getArticleStats);

// Get trending articles
router.get("/trending", getTrendingArticles);

// ========================================
// ADMIN ROUTES
// ========================================

// Example admin protection
router.get("/admin/test", auth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Analytics admin route working",
  });
});

export default router;

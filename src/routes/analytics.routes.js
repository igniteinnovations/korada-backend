import express from "express";

import auth from "../middleware/auth.js";

import {
  trackView,
  trackSession,
  getArticleStats,
  getTrendingArticles,
  getAllAnalytics,
} from "../controllers/analytics.controller.js";

const router = express.Router();

// ========================================
// PUBLIC TRACKING ROUTES
// ========================================

// Track View
router.post("/track/view", trackView);

// Track Session Time + Bounce Rate
router.post("/track/session", trackSession);

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
router.get("/admin/all", auth, getAllAnalytics);
router.get("/admin/test", auth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Analytics admin route working",
  });
});

export default router;

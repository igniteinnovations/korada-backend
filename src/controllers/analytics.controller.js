import ArticleView from "../models/articleView.model.js";
import AnalyticsStat from "../models/articleStats.js";
import News from "../models/news.model.js";
import { v4 as uuidv4 } from "uuid";
// ========================================
// TRACK VIEW
// ========================================

export const trackView = async (req, res, next) => {
  try {
    const { articleId, sessionId, device } = req.body;

    // Validate
    if (!articleId) {
      return res.status(400).json({
        success: false,
        message: "articleId is required",
      });
    }

    // Find article
    const article = await News.findOne({
      newsId: articleId,
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    const viewId = uuidv4();
    if (sessionId) {
      const existingView = await ArticleView.findOne({
        articleId,
        sessionId,
      });

      if (existingView) {
        return res.status(200).json({
          success: true,
          message: "View already counted",
        });
      }
    }

    // Create view
    await ArticleView.create({
      viewId,

      articleId,

      articleSlug:
        typeof article.slug === "object" ? article.slug.english : article.slug,

      sessionId,

      device: device || "unknown",
    });

    // Update stats
    await AnalyticsStat.findOneAndUpdate(
      {
        articleId,
      },

      {
        articleSlug:
          typeof article.slug === "object"
            ? article.slug.english
            : article.slug,

        $inc: {
          totalViews: 1,
        },
      },

      {
        upsert: true,
        returnDocument: "after",
      },
    );

    res.status(201).json({
      success: true,
      message: "View tracked successfully",
    });
  } catch (error) {
    console.error("❌ Error tracking view:", error);

    next(error);
  }
};

// ========================================
// TRACK SESSION
// ========================================

export const trackSession = async (req, res, next) => {
  try {
    const { articleId, seconds, sessionId, device } = req.body;

    const sessionTime = seconds;
    console.log(req.body);
    // Validate
    if (!articleId || sessionTime === undefined) {
      return res.status(400).json({
        success: false,
        message: "articleId and sessionTime are required",
      });
    }
    if (Number(sessionTime) < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid session time",
      });
    }

    if (Number(sessionTime) > 7200) {
      return res.status(400).json({
        success: false,
        message: "Session time too large",
      });
    }

    // Find stats
    const stats = await AnalyticsStat.findOne({
      articleId,
    });

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: "Analytics not found",
      });
    }

    // Update session time
    stats.totalSessionTime += Number(sessionTime);

    stats.totalSessions += 1;

    // Bounce detection
    if (Number(sessionTime) <= 5) {
      stats.bounceCount += 1;
    }

    // Average session
    if (stats.totalSessions > 0) {
      stats.averageSessionTime = stats.totalSessionTime / stats.totalSessions;

      stats.bounceRate = (stats.bounceCount / stats.totalSessions) * 100;
    }

    await stats.save();

    res.status(200).json({
      success: true,
      message: "Session tracked successfully",
      stats,
    });
  } catch (error) {
    console.error("❌ Error tracking session:", error);

    next(error);
  }
};

// ========================================
// GET ARTICLE STATS
// ========================================

export const getArticleStats = async (req, res, next) => {
  try {
    const { articleId } = req.params;

    const stats = await AnalyticsStat.findOne({
      articleId,
    });

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: "Analytics not found",
      });
    }

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("❌ Error fetching analytics:", error);

    next(error);
  }
};

// ========================================
// TRENDING ARTICLES
// ========================================

export const getTrendingArticles = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const trending = await AnalyticsStat.aggregate([
      {
        $sort: {
          totalViews: -1,
        },
      },

      {
        $limit: Number(limit),
      },

      {
        $lookup: {
          from: "news",
          localField: "articleId",
          foreignField: "newsId",
          as: "article",
        },
      },

      {
        $unwind: "$article",
      },
    ]);

    res.status(200).json({
      success: true,
      trending,
    });
  } catch (error) {
    console.error("❌ Error fetching trending articles:", error);

    next(error);
  }
};

//get all stats

export const getAllAnalytics = async (req, res, next) => {
  try {
    const analytics = await AnalyticsStat.find().sort({
      totalViews: -1,
    });

    res.status(200).json({
      success: true,
      total: analytics.length,
      analytics,
    });
  } catch (error) {
    console.error("❌ Error fetching analytics:", error);

    next(error);
  }
};

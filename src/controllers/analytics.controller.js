import ArticleView from "../models/articleView.model.js";
import ArticleShare from "../models/articleShare.model.js";
import ArticleComment from "../models/articleComment.model.js";
import AnalyticsStat from "../models/articlestats.js";
import ArticleLike from "../models/articleLike.model.js";

import News from "../models/news.model.js";

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

    // Generate viewId
    const totalViews = await ArticleView.countDocuments();

    const viewId = `VIEW${String(totalViews + 1).padStart(6, "0")}`;

    // Create view
    await ArticleView.create({
      viewId,

      articleId,

      articleSlug: article.slug,

      sessionId,

      device,
    });

    // Update stats
    await AnalyticsStat.findOneAndUpdate(
      {
        articleId,
      },

      {
        articleSlug: article.slug,

        $inc: {
          totalViews: 1,
        },
      },

      {
        upsert: true,
        new: true,
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
// TOGGLE LIKE
// ========================================

export const toggleLike = async (req, res, next) => {
  try {
    const { articleId, sessionId } = req.body;

    // Validate
    if (!articleId || !sessionId) {
      return res.status(400).json({
        success: false,
        message: "articleId and sessionId are required",
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

    // Existing like?
    const existingLike = await ArticleLike.findOne({
      articleId,
      sessionId,
    });

    // Unlike
    if (existingLike) {
      await ArticleLike.deleteOne({
        _id: existingLike._id,
      });

      await AnalyticsStat.findOneAndUpdate(
        {
          articleId,
        },

        {
          $inc: {
            totalLikes: -1,
          },
        },
      );

      return res.status(200).json({
        success: true,
        liked: false,
        message: "Article unliked",
      });
    }

    // Generate likeId
    const totalLikes = await ArticleLike.countDocuments();

    const likeId = `LIKE${String(totalLikes + 1).padStart(6, "0")}`;

    // Create like
    await ArticleLike.create({
      likeId,

      articleId,

      articleSlug: article.slug,

      sessionId,
    });

    // Increment stats
    await AnalyticsStat.findOneAndUpdate(
      {
        articleId,
      },

      {
        articleSlug: article.slug,

        $inc: {
          totalLikes: 1,
        },
      },

      {
        upsert: true,
      },
    );

    res.status(201).json({
      success: true,
      liked: true,
      message: "Article liked",
    });
  } catch (error) {
    console.error("❌ Error toggling like:", error);

    next(error);
  }
};
// ========================================
// TRACK SHARE
// ========================================

export const trackShare = async (req, res, next) => {
  try {
    const { articleId, platform } = req.body;

    // Validate
    if (!articleId || !platform) {
      return res.status(400).json({
        success: false,
        message: "articleId and platform are required",
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

    // Generate shareId
    const totalShares = await ArticleShare.countDocuments();

    const shareId = `SHARE${String(totalShares + 1).padStart(6, "0")}`;

    // Create share
    await ArticleShare.create({
      shareId,

      articleId,

      articleSlug: article.slug,

      platform,
    });

    // Update stats
    await AnalyticsStat.findOneAndUpdate(
      {
        articleId,
      },

      {
        articleSlug: article.slug,

        $inc: {
          totalShares: 1,
        },
      },

      {
        upsert: true,
        new: true,
      },
    );

    res.status(201).json({
      success: true,
      message: "Share tracked successfully",
    });
  } catch (error) {
    console.error("❌ Error tracking share:", error);

    next(error);
  }
};

// ========================================
// TRACK COMMENT
// ========================================

export const trackComment = async (req, res, next) => {
  try {
    const { articleId, userName, text } = req.body;

    // Validate
    if (!articleId || !text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "articleId and text are required",
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

    // Generate commentId
    const totalComments = await ArticleComment.countDocuments();

    const commentId = `COM${String(totalComments + 1).padStart(6, "0")}`;

    // Create comment
    await ArticleComment.create({
      commentId,

      articleId,

      articleSlug: article.slug,

      userName,

      text,
    });

    // Update stats
    await AnalyticsStat.findOneAndUpdate(
      {
        articleId,
      },

      {
        articleSlug: article.slug,

        $inc: {
          totalComments: 1,
        },
      },

      {
        upsert: true,
        new: true,
      },
    );

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
    });
  } catch (error) {
    console.error("❌ Error tracking comment:", error);

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

    const trending = await AnalyticsStat.find()
      .sort({
        totalViews: -1,
      })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      trending,
    });
  } catch (error) {
    console.error("❌ Error fetching trending articles:", error);

    next(error);
  }
};

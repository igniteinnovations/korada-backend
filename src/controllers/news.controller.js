import News from "../models/news.model.js";
import Category from "../models/Category.js";
import AnalyticsStat from "../models/articleStats.js";
import pagination from "../utils/pagination.js";

// ========================================
// CREATE NEWS
// ========================================

export const createNews = async (req, res, next) => {
  try {
    const {
      title,
      content,
      mediaType,
      mediaUrl,
      categoryId,
      categoryName,
      language,

      expertName,
      expertRole,
      expertImage,
      shortBio,
    } = req.body;

    // Validate title
    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    // Validate language
    if (!["english", "telugu"].includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Language must be english or telugu",
      });
    }

    // Generate slug
    const slug = title.trim().toLowerCase().replace(/\s+/g, "-");

    // Duplicate slug check
    const existingNews = await News.findOne({
      slug,
    });

    if (existingNews) {
      return res.status(409).json({
        success: false,
        message: "News already exists",
      });
    }

    // Generate newsId
    const latestNews = await News.findOne().sort({
      createdAt: -1,
    });

    let newsId = "NEWS0001";

    if (latestNews?.newsId) {
      const lastNumber = parseInt(latestNews.newsId.replace("NEWS", ""));

      newsId = `NEWS${String(lastNumber + 1).padStart(4, "0")}`;
    }

    // Validate media type
    const validTypes = ["image", "video"];

    const finalMediaType = mediaType?.toLowerCase() || "image";

    if (!validTypes.includes(finalMediaType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid media type",
      });
    }

    // Category handling
    let finalCategoryId = categoryId || null;

    let finalCategoryName = "";

    if (categoryId) {
      const category = await Category.findOne({
        categoryId,
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
      // ✅ Language validation
      if (category.language !== language) {
        return res.status(400).json({
          success: false,
          message: "Category language mismatch",
        });
      }
      finalCategoryName = category.categoryname;
    } else if (categoryName?.trim()) {
      const category = await Category.findOne({
        categoryname: categoryName.trim(),
        language,
      });

      finalCategoryId = category.categoryId;

      finalCategoryName = category.categoryname;
    }
    if (finalCategoryName?.toLowerCase() === "expertvoices") {
      if (!expertName || !expertRole || !expertImage || !shortBio) {
        return res.status(400).json({
          success: false,
          message: "All expert fields are required",
        });
      }
    }
    // Create News
    const newsData = {
      newsId,

      title: title.trim(),

      slug,

      content: content?.trim() || "",

      language,

      mediaType: finalMediaType,

      mediaUrl,

      categoryId: finalCategoryId,

      categoryName: finalCategoryName,
      expertName,
      expertRole,
      expertImage,
      shortBio,
    };

    const newNews = await News.create(newsData);

    // Create analytics
    await AnalyticsStat.create({
      articleId: newNews.newsId,

      articleSlug: newNews.slug,
    });

    res.status(201).json({
      success: true,
      message: "News created successfully",
      news: newNews,
    });
  } catch (error) {
    console.error("❌ Error creating news:", error);

    next(error);
  }
};

// ========================================
// EDIT NEWS
// ========================================

export const editNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      title,
      content,
      mediaType,
      mediaUrl,
      categoryId,
      categoryName,
      language,
      expertName,
      expertRole,
      expertImage,
      shortBio,
    } = req.body;

    // Find news
    const news = await News.findOne({
      newsId: id,
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    // ========================================
    // UPDATE TITLE + SLUG
    // ========================================

    if (title?.trim()) {
      const cleanTitle = title.trim();

      const newSlug = cleanTitle.toLowerCase().replace(/\s+/g, "-");

      // Duplicate check
      const existingSlug = await News.findOne({
        slug: newSlug,
        newsId: { $ne: id },
      });

      if (existingSlug) {
        return res.status(409).json({
          success: false,
          message: "Another news with same title already exists",
        });
      }

      news.title = cleanTitle;

      news.slug = newSlug;
    }

    // ========================================
    // UPDATE CONTENT
    // ========================================

    if (content !== undefined) {
      news.content = content.trim();
    }

    // ========================================
    // UPDATE LANGUAGE
    // ========================================

    if (language) {
      if (!["english", "telugu"].includes(language)) {
        return res.status(400).json({
          success: false,
          message: "Language must be english or telugu",
        });
      }

      news.language = language;
    }

    // ========================================
    // UPDATE MEDIA
    // ========================================

    if (mediaUrl) {
      news.mediaUrl = mediaUrl.trim();
    }

    // ========================================
    // UPDATE MEDIA TYPE
    // ========================================

    if (mediaType) {
      const validTypes = ["image", "video"];

      if (!validTypes.includes(mediaType.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: "Invalid media type",
        });
      }

      news.mediaType = mediaType.toLowerCase();
    }

    // ========================================
    // UPDATE CATEGORY
    // ========================================

    if (categoryId || categoryName) {
      let finalCategoryId = categoryId;

      let finalCategoryName = "";

      if (categoryId) {
        const category = await Category.findOne({
          categoryId,
        });

        if (!category) {
          return res.status(404).json({
            success: false,
            message: "Category not found",
          });
        }
        // ✅ Language validation
        if (category.language !== language) {
          return res.status(400).json({
            success: false,
            message: "Category language mismatch",
          });
        }
        finalCategoryId = category.categoryId;

        finalCategoryName = category.categoryname;
      } else if (categoryName?.trim()) {
        const category = await Category.findOne({
          categoryname: categoryName.trim(),
          language: language || news.language,
        });

        if (!category) {
          return res.status(404).json({
            success: false,
            message: "Category not found",
          });
        }

        finalCategoryId = category.categoryId;

        finalCategoryName = category.categoryname;
      }

      news.categoryId = finalCategoryId;

      news.categoryName = finalCategoryName;
    }
    if (expertName !== undefined) {
      news.expertName = expertName;
    }

    if (expertRole !== undefined) {
      news.expertRole = expertRole;
    }

    if (expertImage !== undefined) {
      news.expertImage = expertImage;
    }

    if (shortBio !== undefined) {
      news.shortBio = shortBio;
    }
    // Save
    await news.save();

    // Update analytics
    await AnalyticsStat.findOneAndUpdate(
      {
        articleId: news.newsId,
      },
      {
        articleSlug: news.slug,
      },
    );

    res.status(200).json({
      success: true,
      message: "News updated successfully",
      news,
    });
  } catch (error) {
    console.error("❌ Error editing news:", error);

    next(error);
  }
};

// ========================================
// DELETE NEWS
// ========================================

export const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const news = await News.findOneAndDelete({
      newsId: id,
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    // Delete analytics
    await AnalyticsStat.findOneAndDelete({
      articleId: news.newsId,
    });

    res.status(200).json({
      success: true,
      message: "News deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting news:", error);

    next(error);
  }
};

// ========================================
// GET ALL NEWS
// ========================================

export const getAllNews = async (req, res, next) => {
  try {
    const { categoryId, categoryName, language } = req.query;

    // Pagination
    const { page, limit, skip } = pagination(req);

    const filter = {};

    // Category filter
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (categoryName) {
      filter.categoryName = {
        $regex: new RegExp(categoryName, "i"),
      };
    }

    // Language filter
    if (language) {
      filter.language = language;
    }

    // Fetch news
    const newsList = await News.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    // Total
    const total = await News.countDocuments(filter);

    res.status(200).json({
      success: true,

      page,

      limit,

      total,

      totalPages: Math.ceil(total / limit),

      allNews: newsList,
    });
  } catch (error) {
    console.error("❌ Error fetching news:", error);

    next(error);
  }
};

// ========================================
// GET SINGLE NEWS
// ========================================

export const getNewsBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const news = await News.findOne({
      slug,
    }).lean();

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    // Get analytics
    const analytics = await AnalyticsStat.findOne({
      articleId: news.newsId,
    });

    res.status(200).json({
      success: true,

      message: "News fetched successfully",

      news,

      analytics,
    });
  } catch (error) {
    console.error("❌ Error fetching news:", error);

    next(error);
  }
};

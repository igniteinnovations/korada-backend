// import News from "../models/news.model.js";
// import Category from "../models/Category.js";
// import pagination from "../utils/pagination.js";

// // 🆕 Create News
// export const createNews = async (req, res, next) => {
//   try {
//     const {
//       title,
//       content,
//       mediaType,
//       mediaUrl: frontendMediaUrl,
//       categoryName,
//     } = req.body;

//     // --------------------------------------------
//     // 🔥 HANDLE MEDIA URL
//     // --------------------------------------------
//     let mediaUrl = frontendMediaUrl || "";

//     // 1️⃣ Validate title
//     if (!title?.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Title is required",
//       });
//     }

//     // 2️⃣ Validate category
//     if (!categoryName?.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Category name is required",
//       });
//     }

//     // 3️⃣ Generate slug
//     const slug = title.trim().toLowerCase().replace(/\s+/g, "-");

//     // 4️⃣ Duplicate slug check
//     const existingNews = await News.findOne({ slug });

//     if (existingNews) {
//       return res.status(409).json({
//         success: false,
//         message: "News already exists",
//       });
//     }

//     // 5️⃣ Validate mediaType
//     const validTypes = ["image", "video"];

//     const finalMediaType = mediaType?.toLowerCase() || "image";

//     if (!validTypes.includes(finalMediaType)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid mediaType. Must be 'image' or 'video'.",
//       });
//     }

//     // 6️⃣ Validate media URL
//     if (mediaUrl) {
//       const url = mediaUrl.trim().toLowerCase();

//       const imageExt = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

//       const videoExt = [".mp4", ".mov", ".avi", ".mkv", ".webm"];

//       const isImage =
//         imageExt.some((ext) => url.endsWith(ext)) ||
//         url.startsWith("data:image") ||
//         url.includes("firebase") ||
//         url.includes("cloudinary.com/image");

//       const isVideo =
//         videoExt.some((ext) => url.endsWith(ext)) ||
//         url.includes("youtube.com") ||
//         url.includes("youtu.be") ||
//         url.includes("vimeo.com") ||
//         url.includes("firebase") ||
//         url.includes("googleapis.com") ||
//         url.includes("drive.google.com") ||
//         url.includes("cloudinary.com/video");

//       if (finalMediaType === "image" && !isImage) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid media URL. Expected image URL.",
//         });
//       }

//       if (finalMediaType === "video" && !isVideo) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid media URL. Expected video URL.",
//         });
//       }
//     }

//     // 7️⃣ Validate category
//     const existingCategory = await Category.findOne({
//       categoryname: categoryName.trim(),
//     });

//     if (!existingCategory) {
//       return res.status(400).json({
//         success: false,
//         message: `Category '${categoryName}' does not exist.`,
//       });
//     }

//     // 8️⃣ Generate News ID
//     const lastNews = await News.findOne({
//       newsId: { $regex: /^NEWS\d+$/ },
//     }).sort({
//       createdAt: -1,
//     });

//     let nextId = 1;

//     if (lastNews?.newsId) {
//       nextId = parseInt(lastNews.newsId.replace("NEWS", "")) + 1;
//     }

//     const newsId = `NEWS${String(nextId).padStart(4, "0")}`;

//     // 9️⃣ Create news
//     const newsData = {
//       newsId,

//       title: title.trim(),

//       slug,

//       content: content?.trim() || "",

//       mediaType: finalMediaType,

//       mediaUrl,

//       // ✅ SAVE CUSTOM CATEGORY ID
//       categoryId: existingCategory.categoryId,

//       categoryName: existingCategory.categoryname,
//     };

//     const newNews = await News.create(newsData);

//     return res.status(201).json({
//       success: true,
//       message: "News created successfully",
//       news: newNews,
//     });
//   } catch (error) {
//     console.error("❌ Error creating news:", error);

//     next(error);
//   }
// };

// // 🆕 Edit News
// export const edi tNews = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const {
//       title,
//       content,
//       mediaUrl: frontendMediaUrl,
//       mediaType,
//       categoryName,
//     } = req.body;

//     // Find news
//     const news = await News.findById(id);

//     if (!news) {
//       return res.status(404).json({
//         success: false,
//         message: "News not found",
//       });
//     }

//     // Media URL
//     let finalMediaUrl = frontendMediaUrl || news.mediaUrl;

//     // Update title + slug
//     if (title?.trim()) {
//       news.title = title.trim();

//       news.slug = title.trim().toLowerCase().replace(/\s+/g, "-");
//     }

//     // Update content
//     if (content !== undefined) {
//       news.content = content.trim();
//     }

//     // Update media
//     if (finalMediaUrl) {
//       news.mediaUrl = finalMediaUrl.trim();
//     }

//     // Update media type
//     if (mediaType) {
//       const validTypes = ["image", "video"];

//       if (!validTypes.includes(mediaType.toLowerCase())) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid mediaType. Must be 'image' or 'video'.",
//         });
//       }

//       news.mediaType = mediaType.toLowerCase();
//     }

//     // Update category
//     if (categoryName?.trim()) {
//       const existingCategory = await Category.findOne({
//         categoryname: categoryName.trim(),
//       });

//       if (!existingCategory) {
//         return res.status(400).json({
//           success: false,
//           message: `Category '${categoryName}' does not exist.`,
//         });
//       }

//       news.categoryId = existingCategory.categoryId;

//       news.categoryName = existingCategory.categoryname;
//     }

//     await news.save();

//     res.status(200).json({
//       success: true,
//       message: "News updated successfully",
//       news,
//     });
//   } catch (error) {
//     console.error("❌ Error editing news:", error);

//     next(error);
//   }
// };

// // 🆕 Delete News
// export const deleteNews = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const news = await News.findByIdAndDelete(id);

//     if (!news) {
//       return res.status(404).json({
//         success: false,
//         message: "News not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "News deleted successfully",
//     });
//   } catch (error) {
//     console.error("❌ Error deleting news:", error);

//     next(error);
//   }
// };

// // 🆕 Get All News
// export const getAllNews = async (req, res, next) => {
//   try {
//     const { categoryName } = req.query;

//     // Pagination
//     const { page, limit, skip } = pagination(req);

//     const filter = {};

//     // Category Filter
//     if (categoryName) {
//       filter.categoryName = {
//         $regex: new RegExp(categoryName, "i"),
//       };
//     }

//     // Fetch news
//     const newsList = await News.find(filter)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     // Total count
//     const total = await News.countDocuments(filter);

//     return res.status(200).json({
//       success: true,

//       message: "News fetched successfully",

//       page,

//       limit,

//       total,

//       totalPages: Math.ceil(total / limit),

//       allNews: newsList,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching news:", error);

//     next(error);
//   }
// };

// // 🆕 Get Single News
// export const getNewsBySlug = async (req, res, next) => {
//   try {
//     const { slug } = req.params;

//     const news = await News.findOne({ slug }).lean();

//     if (!news) {
//       return res.status(404).json({
//         success: false,
//         message: "News not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "News fetched successfully",
//       news,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching news:", error);

//     next(error);
//   }
// };

import News from "../models/news.model.js";
import { translateText } from "../utils/translate.js";
import Category from "../models/Category.js";

import AnalyticsStat from "../models/articleStats.js";

import pagination from "../utils/pagination.js";

// ========================================
// CREATE NEWS
// ========================================

export const createNews = async (req, res, next) => {
  try {
    const { title, content, mediaType, mediaUrl, categoryId, categoryName } =
      req.body;

    // Validate title
    if (
      !title ||
      (typeof title !== "string" && !title.english) ||
      (typeof title === "string" && !title.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    // Generate slug
    const englishTitle =
      typeof title === "string" ? title.trim() : title.english?.trim();
    const englishContent =
      typeof content === "string"
        ? content.trim()
        : content?.english?.trim() || "";

    // Auto Translation
    const teluguTitle = await translateText(englishTitle, "te");

    const teluguContent = await translateText(englishContent, "te");

    // Slugs
    const englishSlug = englishTitle.toLowerCase().replace(/\s+/g, "-");

    const teluguSlug = teluguTitle
      .toLowerCase()
      .replace(/[^\u0C00-\u0C7Fa-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .trim();

    // Duplicate slug check
    const existingNews = await News.findOne({
      "slug.english": englishSlug,
    });

    if (existingNews) {
      return res.status(409).json({
        success: false,
        message: "News already exists",
      });
    }

    // Generate newsId
    const latestNews = await News.findOne().sort({ createdAt: -1 });

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

    let finalCategoryName = {};

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

      finalCategoryName = category.categoryname;
    } else if (categoryName?.trim()) {
      const category = await Category.findOne({
        "categoryname.english": categoryName.trim(),
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

    // Create news
    const newsData = {
      newsId,

      title: {
        english: englishTitle,
        telugu: teluguTitle,
      },

      slug: {
        english: englishSlug,
        telugu: teluguSlug,
      },

      content: {
        english: englishContent,
        telugu: teluguContent,
      },

      mediaType: finalMediaType,

      mediaUrl,

      categoryId: finalCategoryId,

      categoryName: finalCategoryName,
    };

    const newNews = await News.create(newsData);

    // Create analytics
    await AnalyticsStat.create({
      articleId: newNews.newsId,

      articleSlug: newNews.slug.english,
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

    const { title, content, mediaType, mediaUrl, categoryId, categoryName } =
      req.body;

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

    if (
      title &&
      ((typeof title === "string" && title.trim()) || title.english)
    ) {
      const englishTitle =
        typeof title === "string" ? title.trim() : title.english?.trim();

      const teluguTitle = await translateText(englishTitle, "te");

      const newEnglishSlug = englishTitle.toLowerCase().replace(/\s+/g, "-");

      const newTeluguSlug = teluguTitle
        .toLowerCase()
        .replace(/[^\u0C00-\u0C7Fa-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .trim();
      // Check duplicate slug excluding current news
      const existingSlug = await News.findOne({
        "slug.english": newEnglishSlug,
        newsId: { $ne: id },
      });

      if (existingSlug) {
        return res.status(409).json({
          success: false,
          message: "Another news with same title already exists",
        });
      }

      news.title = {
        english: englishTitle,
        telugu: teluguTitle,
      };

      news.slug = {
        english: newEnglishSlug,
        telugu: newTeluguSlug,
      };
    }

    // ========================================
    // UPDATE CONTENT
    // ========================================

    if (content !== undefined) {
      const englishContent =
        typeof content === "string"
          ? content.trim()
          : content?.english?.trim() || "";

      const teluguContent = await translateText(englishContent, "te");

      news.content = {
        english: englishContent,
        telugu: teluguContent,
      };
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

      let finalCategoryName = {};

      if (categoryId) {
        const category = await Category.findOne({
          categoryId: id,
        });

        if (!category) {
          return res.status(404).json({
            success: false,
            message: "Category not found",
          });
        }

        finalCategoryId = category.categoryId;

        finalCategoryName = category.categoryname;
      } else if (categoryName?.trim()) {
        const category = await Category.findOne({
          "categoryname.english": categoryName.trim(),
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

    // ========================================
    // SAVE
    // ========================================

    await news.save();

    // ========================================
    // UPDATE ANALYTICS
    // ========================================

    await AnalyticsStat.findOneAndUpdate(
      {
        articleId: news.newsId,
      },
      {
        articleSlug: news.slug.english,
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
    const { categoryId, categoryName } = req.query;

    // Pagination
    const { page, limit, skip } = pagination(req);

    const filter = {};

    // Category filters
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (categoryName) {
      filter["categoryName.english"] = {
        $regex: new RegExp(categoryName, "i"),
      };
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
      $or: [{ "slug.english": slug }, { "slug.telugu": slug }],
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

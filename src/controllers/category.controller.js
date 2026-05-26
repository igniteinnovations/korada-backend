import Category from "../models/Category.js";
import News from "../models/news.model.js";
// ========================================
// CREATE CATEGORY
// ========================================

export const createCategory = async (req, res, next) => {
  try {
    const { categoryname, language } = req.body;

    // Validation
    if (!categoryname?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
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
    const slug = categoryname.trim().toLowerCase().replace(/\s+/g, "-");

    // Check existing category
    const existingCategory = await Category.findOne({
      slug,
      language,
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    // Get Last Category
    const lastCategory = await Category.findOne({
      categoryId: { $exists: true },
    }).sort({
      createdAt: -1,
    });

    let nextId = 1;

    if (lastCategory?.categoryId) {
      nextId = parseInt(lastCategory.categoryId.replace("CAT", "")) + 1;
    }

    // Generate Category ID
    const categoryId = `CAT${String(nextId).padStart(4, "0")}`;

    // Create Category
    const category = await Category.create({
      categoryId,

      categoryname: categoryname.trim(),

      slug,

      language,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("❌ Error creating category:", error);

    next(error);
  }
};

// ========================================
// GET ALL CATEGORIES
// ========================================

export const getAllCategories = async (req, res, next) => {
  try {
    const { language } = req.query;

    const filter = {};

    if (language) {
      filter.language = language;
    }

    const categories = await Category.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("❌ Error fetching categories:", error);

    next(error);
  }
};

// ========================================
// EDIT CATEGORY
// ========================================

export const editCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { categoryname, language } = req.body;

    // Validation
    if (!categoryname?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Validate language
    if (!["english", "telugu"].includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Language must be english or telugu",
      });
    }

    // Find category
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Generate slug
    const slug = categoryname.trim().toLowerCase().replace(/\s+/g, "-");

    // Duplicate check
    const existingCategory = await Category.findOne({
      slug,
      language,
      _id: { $ne: id },
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    // Update category
    category.categoryname = categoryname.trim();

    category.slug = slug;

    category.language = language;

    await category.save();
    // ✅ Sync category name in news
    await News.updateMany(
      { categoryId: category.categoryId },
      {
        $set: {
          categoryName: category.categoryname,
        },
      },
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("❌ Error updating category:", error);

    next(error);
  }
};

// ========================================
// DELETE CATEGORY
// ========================================

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ✅ Check linked news
    const newsExists = await News.exists({
      categoryId: category.categoryId,
    });

    if (newsExists) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category linked with news",
      });
    }

    // ✅ Delete category
    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting category:", error);

    next(error);
  }
};

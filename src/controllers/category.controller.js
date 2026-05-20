import Category from "../models/Category.js";

// 🆕 Create Category
// 🆕 Create Category
export const createCategory = async (req, res, next) => {
  try {
    const { categoryname } = req.body;

    // Validation
    if (!categoryname?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Generate slug
    const slug = categoryname.trim().toLowerCase().replace(/\s+/g, "-");

    // Check existing category
    const existingCategory = await Category.findOne({
      $or: [{ categoryname: categoryname.trim() }, { slug }],
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

    // Generate Custom Category ID
    const categoryId = `CAT${String(nextId).padStart(4, "0")}`;

    // Create Category
    const category = await Category.create({
      categoryId,
      categoryname: categoryname.trim(),
      slug,
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

// 🆕 Get All Categories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({
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

// 🆕 Edit Category
export const editCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { categoryname } = req.body;

    // Validation
    if (!categoryname?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
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

    await category.save();

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

// 🆕 Delete Category
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting category:", error);

    next(error);
  }
};

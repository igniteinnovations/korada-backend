import WeekendExperience from "../models/weekendExperience.model.js";

import pagination from "../utils/pagination.js";

// 🆕 Create Weekend Experience
export const createWeekendExperience = async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      distance,
      duration,
      price,
      rating,
      tags,
      mediaType,
      mediaUrl,
      isFeatured,
    } = req.body;

    // Validation
    if (
      !title?.trim() ||
      !description?.trim() ||
      !location?.trim() ||
      !mediaUrl?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // Generate slug
    const slug = title.trim().toLowerCase().replace(/\s+/g, "-");

    // Duplicate check
    const existingExperience = await WeekendExperience.findOne({
      slug,
    });

    if (existingExperience) {
      return res.status(409).json({
        success: false,
        message: "Weekend experience already exists",
      });
    }

    // Generate experienceId
    const lastExperience = await WeekendExperience.findOne({
      experienceId: { $regex: /^EXP\d+$/ },
    }).sort({
      createdAt: -1,
    });

    let nextId = 1;

    if (lastExperience?.experienceId) {
      nextId = parseInt(lastExperience.experienceId.replace("EXP", ""), 10) + 1;
    }

    const experienceId = `EXP${String(nextId).padStart(4, "0")}`;
    // Create experience
    const experience = await WeekendExperience.create({
      experienceId,

      title: title.trim(),

      slug,

      description: description.trim(),

      location: location.trim(),

      distance,

      duration,

      price,

      rating,

      tags: tags || [],

      mediaType: mediaType || "image",

      mediaUrl,

      isFeatured: isFeatured || false,
    });

    res.status(201).json({
      success: true,
      message: "Weekend experience created successfully",
      experience,
    });
  } catch (error) {
    console.error("❌ Error creating weekend experience:", error);

    next(error);
  }
};

// 🆕 Get All Weekend Experiences
export const getAllWeekendExperiences = async (req, res, next) => {
  try {
    const { location, featured } = req.query;

    // Pagination
    const { page, limit, skip } = pagination(req);

    const filter = {};

    // Filters
    if (location) {
      filter.location = {
        $regex: new RegExp(location, "i"),
      };
    }

    if (featured === "true") {
      filter.isFeatured = true;
    }

    // Fetch experiences
    const experiences = await WeekendExperience.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Total count
    const total = await WeekendExperience.countDocuments(filter);

    res.status(200).json({
      success: true,

      page,

      limit,

      total,

      totalPages: Math.ceil(total / limit),

      experiences,
    });
  } catch (error) {
    console.error("❌ Error fetching weekend experiences:", error);

    next(error);
  }
};

// 🆕 Get Single Weekend Experience
export const getSingleWeekendExperience = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const experience = await WeekendExperience.findOne({
      slug,
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Weekend experience not found",
      });
    }

    res.status(200).json({
      success: true,
      experience,
    });
  } catch (error) {
    console.error("❌ Error fetching weekend experience:", error);

    next(error);
  }
};

// 🆕 Edit Weekend Experience
export const editWeekendExperience = async (req, res, next) => {
  try {
    const { experienceId } = req.params;

    const experience = await WeekendExperience.findOne({
      experienceId,
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Weekend experience not found",
      });
    }

    Object.assign(experience, req.body);

    // Update slug if title changes
    if (req.body.title) {
      experience.slug = req.body.title
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
    }

    await experience.save();

    res.status(200).json({
      success: true,
      message: "Weekend experience updated successfully",
      experience,
    });
  } catch (error) {
    console.error("❌ Error editing weekend experience:", error);

    next(error);
  }
};

// 🆕 Delete Weekend Experience
export const deleteWeekendExperience = async (req, res, next) => {
  try {
    const { experienceId } = req.params;

    const experience = await WeekendExperience.findOneAndDelete({
      experienceId,
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Weekend experience not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Weekend experience deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting weekend experience:", error);

    next(error);
  }
};

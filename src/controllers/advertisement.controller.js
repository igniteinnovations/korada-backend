import Advertisement from "../models/advertisement.model.js";

import pagination from "../utils/pagination.js";

// Create Advertisement
export const createAdvertisement = async (req, res, next) => {
  try {
    const {
      title,
      imageUrl,
      redirectUrl,
      position,
      isActive,
      startDate,
      endDate,
    } = req.body;

    // Validation
    if (!title?.trim() || !imageUrl?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }
    const existingAdvertisement = await Advertisement.findOne({
      title: title.trim(),
      imageUrl: imageUrl.trim(),
    });

    if (existingAdvertisement) {
      return res.status(409).json({
        success: false,
        message: "Advertisement already exists",
      });
    }
    // Generate advertisementId
    const lastAdvertisement = await Advertisement.findOne().sort({
      advertisementId: -1,
    });

    let advertisementId = "AD0001";

    if (lastAdvertisement) {
      const lastNumber = parseInt(
        lastAdvertisement.advertisementId.replace("AD", ""),
      );

      advertisementId = `AD${String(lastNumber + 1).padStart(4, "0")}`;
    }

    // Create advertisement
    const advertisement = await Advertisement.create({
      advertisementId,

      title: title.trim(),

      imageUrl: imageUrl.trim(),

      redirectUrl: redirectUrl?.trim() || "",
      position: position.trim(),

      isActive: isActive ?? true,

      startDate,

      endDate,
    });

    res.status(201).json({
      success: true,
      message: "Advertisement created successfully",
      advertisement,
    });
  } catch (error) {
    console.error("❌ Error creating advertisement:", error);

    next(error);
  }
};

//  Get All Advertisements
export const getAllAdvertisements = async (req, res, next) => {
  try {
    const { active } = req.query;

    // Pagination
    const { page, limit, skip } = pagination(req);

    const filter = {};

    // Active filter
    if (active === "true") {
      filter.isActive = true;
    }

    // Fetch ads
    const advertisements = await Advertisement.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Total count
    const total = await Advertisement.countDocuments(filter);

    res.status(200).json({
      success: true,

      page,

      limit,

      total,

      totalPages: Math.ceil(total / limit),

      advertisements,
    });
  } catch (error) {
    console.error("❌ Error fetching advertisements:", error);

    next(error);
  }
};

// Get Single Advertisement
export const getSingleAdvertisement = async (req, res, next) => {
  try {
    const { advertisementId } = req.params;

    const advertisement = await Advertisement.findOne({
      advertisementId,
    });

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    res.status(200).json({
      success: true,
      advertisement,
    });
  } catch (error) {
    console.error("❌ Error fetching advertisement:", error);

    next(error);
  }
};

// Edit Advertisement
export const editAdvertisement = async (req, res, next) => {
  try {
    const { advertisementId } = req.params;

    const advertisement = await Advertisement.findOne({
      advertisementId,
    });

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    Object.assign(advertisement, req.body);

    await advertisement.save();

    res.status(200).json({
      success: true,
      message: "Advertisement updated successfully",
      advertisement,
    });
  } catch (error) {
    console.error("❌ Error updating advertisement:", error);

    next(error);
  }
};

//  Delete Advertisement
export const deleteAdvertisement = async (req, res, next) => {
  try {
    const { advertisementId } = req.params;

    const advertisement = await Advertisement.findOneAndDelete({
      advertisementId,
    });

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Advertisement deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting advertisement:", error);

    next(error);
  }
};

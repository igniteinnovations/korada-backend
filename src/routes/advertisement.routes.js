import express from "express";

import auth from "../middleware/auth.js";

import {
  createAdvertisement,
  getAllAdvertisements,
  getSingleAdvertisement,
  editAdvertisement,
  deleteAdvertisement,
} from "../controllers/advertisement.controller.js";

const router = express.Router();

// Public Routes
router.get("/", getAllAdvertisements);

router.get("/:advertisementId", getSingleAdvertisement);

// Protected Routes
router.post("/", auth, createAdvertisement);

router.put("/:advertisementId", auth, editAdvertisement);

router.delete("/:advertisementId", auth, deleteAdvertisement);

export default router;

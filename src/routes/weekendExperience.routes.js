import express from "express";

import auth from "../middleware/auth.js";

import {
  createWeekendExperience,
  getAllWeekendExperiences,
  getSingleWeekendExperience,
  editWeekendExperience,
  deleteWeekendExperience,
} from "../controllers/weekendExperience.controller.js";

const router = express.Router();

// Public Routes
router.get("/", getAllWeekendExperiences);

router.get("/:slug", getSingleWeekendExperience);

// Protected Routes
router.post("/", auth, createWeekendExperience);

router.put("/:experienceId", auth, editWeekendExperience);

router.delete("/:experienceId", auth, deleteWeekendExperience);

export default router;

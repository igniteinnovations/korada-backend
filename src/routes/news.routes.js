import express from "express";

import auth from "../middleware/auth.js";

import {
  createNews,
  editNews,
  deleteNews,
  getAllNews,
  getNewsBySlug,
} from "../controllers/news.controller.js";

const router = express.Router();

// Public Routes
router.get("/", getAllNews);

router.get("/:slug", getNewsBySlug);

// Protected Routes
router.post("/", auth, createNews);

router.put("/:id", auth, editNews);

router.delete("/:id", auth, deleteNews);

export default router;

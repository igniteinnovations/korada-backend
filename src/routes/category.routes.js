import express from "express";

import auth from "../middleware/auth.js";

import {
  createCategory,
  getAllCategories,
  editCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

// Public Route
router.get("/", getAllCategories);

// Protected Routes
router.post("/create", auth, createCategory);

router.put("/:id", auth, editCategory);

router.delete("/:id", auth, deleteCategory);

export default router;

import express from "express";

import {
  registerAdmin,
  loginAdmin,
  changePassword,
} from "../controllers/adminAuth.controller.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerAdmin);

router.post("/login", loginAdmin);

router.put("/change-password", auth, changePassword);

export default router;

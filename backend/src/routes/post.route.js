import express from "express";
import { createPost, getAllPosts } from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllPosts);

// Protected routes (require authentication)
router.post("/", protectRoute, createPost);

export default router;

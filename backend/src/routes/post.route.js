import express from "express";
import { createPost, getAllPosts, getUserPosts } from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllPosts);
router.get("/user/:userId", getUserPosts);

// Protected routes (require authentication)
router.post("/", protectRoute, createPost);

export default router;

import { Router } from "express";

import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

// All post endpoints require authentication
router.use(authenticateToken);

router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
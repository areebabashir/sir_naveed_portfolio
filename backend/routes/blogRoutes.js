import express from "express";
import {
    createBlog,
    getAllBlogs,
    getBlogBySlug,
    getBlogById,
    updateBlog,
    deleteBlog,
    getBlogStats,
    getCategoriesAndTags
} from "../controllers/blogController.js";
import { requireSignIn, isUser } from "../Middlewares/authMiddlewares.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/", getAllBlogs); // Get all published blogs
router.get("/categories-tags", getCategoriesAndTags); // Get categories and tags
router.get("/:slug", getBlogBySlug); // Get blog by slug (public)

// Protected routes (authentication required)
router.post("/", requireSignIn, isUser, createBlog); // Create new blog
router.post("/upload", requireSignIn, isUser, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.json({ 
        success: true, 
        imageUrl: `/uploads/${req.file.filename}`,
        filename: req.file.filename
    });
}); // Upload image
router.get("/admin/all", requireSignIn, isUser, getAllBlogs); // Get all blogs (including drafts)
router.get("/admin/stats", requireSignIn, isUser, getBlogStats); // Get blog statistics
router.get("/admin/:id", requireSignIn, isUser, getBlogById); // Get blog by ID for editing
router.put("/:id", requireSignIn, isUser, updateBlog); // Update blog
router.delete("/:id", requireSignIn, isUser, deleteBlog); // Delete blog

export default router;

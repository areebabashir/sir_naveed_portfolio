import express from "express";
import {
    createService,
    getAllServices,
    getServiceBySlug,
    getServiceById,
    updateService,
    deleteService,
    getServiceStats,
    getCategoriesAndTags,
    recordInquiry,
    bulkUpdateServices
} from "../controllers/serviceController.js";
import { requireSignIn, isUser } from "../Middlewares/authMiddlewares.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/", getAllServices); // Get all published services
router.get("/categories-tags", getCategoriesAndTags); // Get categories and tags
router.get("/:slug", getServiceBySlug); // Get service by slug (public)
router.post("/:slug/inquiry", recordInquiry); // Record inquiry (public)

// Protected routes (authentication required)
router.post("/", requireSignIn, isUser, createService); // Create new service
router.post("/upload", requireSignIn, isUser, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.json({ 
        success: true, 
        imageUrl: `/uploads/${req.file.filename}`,
        filename: req.file.filename
    });
}); // Upload service image
router.get("/admin/all", requireSignIn, isUser, getAllServices); // Get all services (including drafts)
router.get("/admin/stats", requireSignIn, isUser, getServiceStats); // Get service statistics
router.get("/admin/:id", requireSignIn, isUser, getServiceById); // Get service by ID for editing
router.put("/:id", requireSignIn, isUser, updateService); // Update service
router.put("/bulk/update", requireSignIn, isUser, bulkUpdateServices); // Bulk update services
router.delete("/:id", requireSignIn, isUser, deleteService); // Delete service

export default router;

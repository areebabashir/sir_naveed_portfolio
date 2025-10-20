import Blog from '../models/blogModel.js';
import auth from '../models/authModel.js';

// Create Blog Post
export const createBlog = async (req, res) => {
    try {
        const {
            title,
            content,
            excerpt,
            featuredImage,
            status,
            metaTitle,
            metaDescription,
            metaKeywords,
            categories,
            tags,
            structuredData
        } = req.body;

        // Validation
        if (!title) return res.status(400).json({ error: "Title is required" });
        if (!content) return res.status(400).json({ error: "Content is required" });
        if (!excerpt) return res.status(400).json({ error: "Excerpt is required" });

        // Check if slug already exists
        let slug = title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');

        let originalSlug = slug;
        let counter = 1;
        while (await Blog.findOne({ slug })) {
            slug = `${originalSlug}-${counter}`;
            counter++;
        }

        const blog = new Blog({
            title,
            slug,
            content,
            excerpt,
            featuredImage,
            author: req.user._id,
            status: status || 'draft',
            metaTitle,
            metaDescription,
            metaKeywords: metaKeywords || [],
            categories: categories || [],
            tags: tags || [],
            structuredData: structuredData || {}
        });

        await blog.save();
        await blog.populate('author', 'name email');

        res.status(201).json({
            success: true,
            message: "Blog post created successfully",
            blog
        });
    } catch (error) {
        console.error('Create blog error:', error);
        res.status(500).json({
            success: false,
            message: "Error creating blog post",
            error: error.message
        });
    }
};

// Get All Blog Posts (with pagination and filtering)
export const getAllBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status || 'published';
        const category = req.query.category;
        const tag = req.query.tag;
        const search = req.query.search;
        const sortBy = req.query.sortBy || 'publishedAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        // Build query
        let query = {};
        
        if (status !== 'all') {
            query.status = status;
        }
        
        if (category) {
            query.categories = { $in: [category] };
        }
        
        if (tag) {
            query.tags = { $in: [tag] };
        }
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;
        
        const blogs = await Blog.find(query)
            .populate('author', 'name email')
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .select('-content'); // Exclude full content for list view

        const total = await Blog.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            blogs,
            pagination: {
                currentPage: page,
                totalPages,
                totalBlogs: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Get all blogs error:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching blog posts",
            error: error.message
        });
    }
};

// Get Single Blog Post by Slug
export const getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        
        const blog = await Blog.findOne({ slug })
            .populate('author', 'name email');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found"
            });
        }

        // Increment view count
        blog.views += 1;
        await blog.save();

        res.status(200).json({
            success: true,
            blog
        });
    } catch (error) {
        console.error('Get blog by slug error:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching blog post",
            error: error.message
        });
    }
};

// Get Blog Post by ID (for editing)
export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const blog = await Blog.findById(id)
            .populate('author', 'name email');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found"
            });
        }

        res.status(200).json({
            success: true,
            blog
        });
    } catch (error) {
        console.error('Get blog by ID error:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching blog post",
            error: error.message
        });
    }
};

// Update Blog Post
export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        console.log('Update request for blog ID:', id);
        console.log('Update data:', {
            title: updateData.title,
            contentLength: updateData.content?.length,
            hasBase64Images: updateData.content?.includes('data:image/')
        });

        // Check if blog exists
        const existingBlog = await Blog.findById(id);
        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found"
            });
        }

        // If title is being updated, generate new slug
        if (updateData.title && updateData.title !== existingBlog.title) {
            let newSlug = updateData.title
                .toLowerCase()
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim('-');

            // Check if new slug already exists (excluding current blog)
            let originalSlug = newSlug;
            let counter = 1;
            while (await Blog.findOne({ slug: newSlug, _id: { $ne: id } })) {
                newSlug = `${originalSlug}-${counter}`;
                counter++;
            }
            updateData.slug = newSlug;
        }

        const blog = await Blog.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('author', 'name email');

        console.log('Blog updated successfully:', {
            id: blog._id,
            title: blog.title,
            contentLength: blog.content?.length,
            hasBase64Images: blog.content?.includes('data:image/')
        });

        res.status(200).json({
            success: true,
            message: "Blog post updated successfully",
            blog
        });
    } catch (error) {
        console.error('Update blog error:', error);
        res.status(500).json({
            success: false,
            message: "Error updating blog post",
            error: error.message
        });
    }
};

// Delete Blog Post
export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog post deleted successfully"
        });
    } catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({
            success: false,
            message: "Error deleting blog post",
            error: error.message
        });
    }
};

// Get Blog Statistics
export const getBlogStats = async (req, res) => {
    try {
        const totalBlogs = await Blog.countDocuments();
        const publishedBlogs = await Blog.countDocuments({ status: 'published' });
        const draftBlogs = await Blog.countDocuments({ status: 'draft' });
        const totalViews = await Blog.aggregate([
            { $group: { _id: null, totalViews: { $sum: '$views' } } }
        ]);

        // Get most popular blogs
        const popularBlogs = await Blog.find({ status: 'published' })
            .sort({ views: -1 })
            .limit(5)
            .select('title slug views publishedAt')
            .populate('author', 'name');

        // Get recent blogs
        const recentBlogs = await Blog.find({ status: 'published' })
            .sort({ publishedAt: -1 })
            .limit(5)
            .select('title slug publishedAt')
            .populate('author', 'name');

        res.status(200).json({
            success: true,
            stats: {
                totalBlogs,
                publishedBlogs,
                draftBlogs,
                totalViews: totalViews[0]?.totalViews || 0,
                popularBlogs,
                recentBlogs
            }
        });
    } catch (error) {
        console.error('Get blog stats error:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching blog statistics",
            error: error.message
        });
    }
};

// Get Categories and Tags
export const getCategoriesAndTags = async (req, res) => {
    try {
        const categories = await Blog.distinct('categories', { status: 'published' });
        const tags = await Blog.distinct('tags', { status: 'published' });

        res.status(200).json({
            success: true,
            categories: categories.filter(cat => cat && cat.trim()),
            tags: tags.filter(tag => tag && tag.trim())
        });
    } catch (error) {
        console.error('Get categories and tags error:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching categories and tags",
            error: error.message
        });
    }
};

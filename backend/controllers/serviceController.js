import Service from '../models/serviceModel.js';

// Create a new service
export const createService = async (req, res) => {
    try {
        const serviceData = req.body;

        // Generate slug if not provided
        if (!serviceData.slug && serviceData.title) {
            let slug = serviceData.title
                .toLowerCase()
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim('-');

            // Check if slug already exists
            let originalSlug = slug;
            let counter = 1;
            while (await Service.findOne({ slug })) {
                slug = `${originalSlug}-${counter}`;
                counter++;
            }
            serviceData.slug = slug;
        }

        const service = new Service(serviceData);
        await service.save();

        res.status(201).json({
            success: true,
            message: "Service created successfully",
            service
        });
    } catch (error) {
        console.error('Create service error:', error);
        res.status(500).json({
            success: false,
            message: "Error creating service",
            error: error.message
        });
    }
};

// Get all services (public)
export const getAllServices = async (req, res) => {
    try {
        // Check if this is an admin request
        const isAdminRequest = req.path.includes('/admin/');
        
        const { 
            page = 1, 
            limit = 10, 
            category, 
            status = isAdminRequest ? 'all' : 'active', 
            featured, 
            sortBy = 'createdAt', 
            sortOrder = 'desc' 
        } = req.query;

        // Build query
        let query = {};
        
        if (status && status !== 'all') {
            query.status = status;
        }
        
        if (category && category !== 'all') {
            query.category = category;
        }
        
        if (featured !== undefined) {
            query.featured = featured === 'true';
        }

        // Sort options
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const services = await Service.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .select('-content') // Exclude full content for listing

        const total = await Service.countDocuments(query);

        res.status(200).json({
            success: true,
            services,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalResults: total,
                hasNext: skip + services.length < total,
                hasPrev: parseInt(page) > 1
            }
        });
    } catch (error) {
        console.error('Get all services error:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching services",
            error: error.message
        });
    }
};

// Get service by slug (public)
export const getServiceBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const service = await Service.findOne({ slug, status: 'active' })

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        // Service found and returned

        res.status(200).json({
            success: true,
            service
        });
    } catch (error) {
        console.error('Get service by slug error:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching service",
            error: error.message
        });
    }
};

// Get service by ID (admin)
export const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findById(id)

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            service
        });
    } catch (error) {
        console.error('Get service by ID error:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching service",
            error: error.message
        });
    }
};

// Update service
export const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check if service exists
        const existingService = await Service.findById(id);
        if (!existingService) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        // If title is being updated, generate new slug
        if (updateData.title && updateData.title !== existingService.title) {
            let newSlug = updateData.title
                .toLowerCase()
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim('-');

            // Check if new slug already exists (excluding current service)
            let originalSlug = newSlug;
            let counter = 1;
            while (await Service.findOne({ slug: newSlug, _id: { $ne: id } })) {
                newSlug = `${originalSlug}-${counter}`;
                counter++;
            }
            updateData.slug = newSlug;
        }

        const service = await Service.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Service updated successfully",
            service
        });
    } catch (error) {
        console.error('Update service error:', error);
        res.status(500).json({
            success: false,
            message: "Error updating service",
            error: error.message
        });
    }
};

// Delete service
export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findByIdAndDelete(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Service deleted successfully"
        });
    } catch (error) {
        console.error('Delete service error:', error);
        res.status(500).json({
            success: false,
            message: "Error deleting service",
            error: error.message
        });
    }
};

// Get service statistics
export const getServiceStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const totalServices = await Service.countDocuments({});
        const activeServices = await Service.countDocuments({ status: 'active' });
        const draftServices = await Service.countDocuments({ status: 'draft' });
        const featuredServices = await Service.countDocuments({ featured: true });

        // Category distribution
        const categoryStats = await Service.aggregate([
            { $match: {} },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const stats = {
            total: totalServices,
            active: activeServices,
            draft: draftServices,
            featured: featuredServices,
            categories: categoryStats
        };

        res.status(200).json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Get service stats error:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching service statistics",
            error: error.message
        });
    }
};

// Get categories and tags
export const getCategoriesAndTags = async (req, res) => {
    try {
        const categories = await Service.distinct('category');
        const tags = await Service.distinct('tags');

        res.status(200).json({
            success: true,
            categories,
            tags: tags.filter(tag => tag && tag.trim() !== '')
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

// Record service inquiry
export const recordInquiry = async (req, res) => {
    try {
        const { slug } = req.params;

        const service = await Service.findOne({ slug });
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Inquiry recorded successfully"
        });
    } catch (error) {
        console.error('Record inquiry error:', error);
        res.status(500).json({
            success: false,
            message: "Error recording inquiry",
            error: error.message
        });
    }
};

// Bulk update services
export const bulkUpdateServices = async (req, res) => {
    try {
        const { serviceIds, updateData } = req.body;

        if (!serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Service IDs are required"
            });
        }

        const result = await Service.updateMany(
            { _id: { $in: serviceIds } },
            updateData
        );

        res.status(200).json({
            success: true,
            message: `${result.modifiedCount} services updated successfully`,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Bulk update services error:', error);
        res.status(500).json({
            success: false,
            message: "Error updating services",
            error: error.message
        });
    }
};

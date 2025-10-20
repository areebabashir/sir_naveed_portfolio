import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    content: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true,
        maxlength: 200
    },
    icon: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'draft'],
        default: 'draft'
    },
    featured: {
        type: Boolean,
        default: false
    },
    // SEO fields
    metaTitle: {
        type: String,
        maxlength: 60
    },
    metaDescription: {
        type: String,
        maxlength: 160
    },
    metaKeywords: [{
        type: String,
        trim: true
    }],
    // Author reference removed as per user request
}, {
    timestamps: true
});

// Index for better performance
serviceSchema.index({ slug: 1 });
serviceSchema.index({ status: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ featured: 1 });

// Pre-save middleware to generate slug
serviceSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }
    next();
});

// Virtual for full image URL
serviceSchema.virtual('imageUrl').get(function() {
    if (this.image && !this.image.startsWith('http')) {
        return `${process.env.BASE_URL || 'http://localhost:8000'}${this.image}`;
    }
    return this.image;
});

// Virtual for full icon URL
serviceSchema.virtual('iconUrl').get(function() {
    if (this.icon && !this.icon.startsWith('http')) {
        return `${process.env.BASE_URL || 'http://localhost:8000'}${this.icon}`;
    }
    return this.icon;
});

export default mongoose.model('Service', serviceSchema);

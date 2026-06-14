import mongoose from 'mongoose';

const InsightSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, required: true },
    coverImage: { type: String },
    featured: { type: Boolean, default: false },
    keyTakeaways: [String],
    articleImages: [String],
    tags: [String],
}, { timestamps: true });

export default mongoose.models.Insight || mongoose.model('Insight', InsightSchema);
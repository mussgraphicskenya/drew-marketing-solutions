import mongoose from 'mongoose';

const CaseStudySchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    client: { type: String, required: true },
    industry: { type: String, required: true },
    problem: { type: String, required: true },
    insight: { type: String, required: true },
    strategy: { type: String, required: true },
    execution: { type: String, required: true },
    results: { type: String, required: true },
    coverImage: { type: String },
    secondaryImage: { type: String },
    featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.CaseStudy || mongoose.model('CaseStudy', CaseStudySchema);
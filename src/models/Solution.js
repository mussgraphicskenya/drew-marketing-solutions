import mongoose from 'mongoose';

const SolutionSchema = new mongoose.Schema({
    title:    { type: String, required: true },
    slug:     { type: String, unique: true },
    headline: { type: String, required: true },
    body:     { type: String, required: true },
    includes: [{ type: String }],
    whyDrewTitle:   { type: String },
    whyDrewContent: { type: String },
    whyDrewIcon:    { type: String },   // optional icon shown above title in the Why Drew? box
    secondBoxIcon:  { type: String },   // kept for backward-compat — superseded by whyDrewIcon
    icon:     { type: String },
    image:    { type: String },
    order:    { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    downloads: [{
        title:   { type: String },
        fileUrl: { type: String },
    }],
}, { timestamps: true });

export default mongoose.models.Solution || mongoose.model('Solution', SolutionSchema);
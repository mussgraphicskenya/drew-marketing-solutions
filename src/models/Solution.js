import mongoose from 'mongoose';

const SolutionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    headline: { type: String, required: true },
    body: { type: String, required: true },
    includes: [{ type: String }],
    icon: { type: String },
    order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Solution || mongoose.model('Solution', SolutionSchema);
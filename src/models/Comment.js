import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    insightSlug: { type: String, required: true },
    name:        { type: String, required: true },
    email:       { type: String, required: true },
    comment:     { type: String, required: true },
    approved:    { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

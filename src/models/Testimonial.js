import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    quote: { type: String, required: true },
    image: { type: String },
    featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
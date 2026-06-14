import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema(
    {
        name:     { type: String, required: true },
        role:     { type: String, required: true },
        image:    { type: String, default: '' },
        facebook: { type: String, default: '' },
        twitter:  { type: String, default: '' },
        linkedin: { type: String, default: '' },
        order:    { type: Number, default: 0 },
    },
    { timestamps: true, collection: 'teams' }
);

const Team = mongoose.models.Team || mongoose.model('Team', TeamSchema);

export default Team;

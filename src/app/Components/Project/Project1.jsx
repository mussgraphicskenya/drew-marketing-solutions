import { unstable_noStore as noStore } from 'next/cache';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import { getCloudinaryUrl } from '@/lib/cloudinaryUrl';
import Project1Slider from './Project1Slider';

/**
 * Server wrapper — fetches real case study data from MongoDB,
 * then passes it to the client-side slider component.
 */
const Project1 = async ({ bgImage, ClassAdd }) => {
    noStore();
    await connectDB();

    const raw = await mongoose.connection
        .collection('casestudies')
        .find({})
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray();

    // Serialise: convert ObjectIds → strings so they can cross the server→client boundary
    const data = raw.map((item) => ({
        _id:        String(item._id),
        title:      item.title     || '',
        industry:   item.industry  || '',
        slug:       item.slug      || '',
        coverImage: getCloudinaryUrl(item.coverImage, 331, 340) || '/assets/images/home-3/project1.jpg',
    }));

    return <Project1Slider data={data} bgImage={bgImage} ClassAdd={ClassAdd} />;
};

export default Project1;
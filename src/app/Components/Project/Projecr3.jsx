import { unstable_noStore as noStore } from 'next/cache';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import { getCloudinaryUrl } from '@/lib/cloudinaryUrl';
import Projecr3Client from './Projecr3Client';

/**
 * Server wrapper — fetches all case studies from MongoDB,
 * extracts distinct industries, then passes everything to the
 * client component for interactive category filtering.
 */
const Projecr3 = async () => {
    noStore();
    await connectDB();

    const raw = await mongoose.connection
        .collection('casestudies')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

    const data = raw.map((item) => ({
        _id:        String(item._id),
        title:      item.title    || '',
        category:   item.industry || 'General',
        slug:       item.slug     || '',
        img:        getCloudinaryUrl(item.coverImage, 606, 447) || '/assets/images/home-3/case-studies.png',
    }));

    // Distinct industry values for filter buttons
    const industries = [...new Set(data.map(d => d.category))].sort();

    return <Projecr3Client data={data} industries={industries} />;
};

export default Projecr3;
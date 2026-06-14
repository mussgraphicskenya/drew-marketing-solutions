import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

const BASE_URL = 'https://www.drewmarketingsolutions.com';

export default async function sitemap() {
    // ── Static routes ─────────────────────────────────────
    const staticRoutes = [
        { url: BASE_URL,              priority: 1.0, changeFrequency: 'weekly' },
        { url: `${BASE_URL}/about`,   priority: 0.8, changeFrequency: 'monthly' },
        { url: `${BASE_URL}/service`, priority: 0.9, changeFrequency: 'monthly' },
        { url: `${BASE_URL}/project`, priority: 0.9, changeFrequency: 'weekly'  },
        { url: `${BASE_URL}/blog`,    priority: 0.9, changeFrequency: 'daily'   },
        { url: `${BASE_URL}/contact`, priority: 0.7, changeFrequency: 'yearly'  },
    ].map((r) => ({ ...r, lastModified: new Date() }));

    // ── Dynamic routes from MongoDB ───────────────────────
    try {
        await connectDB();

        const [insights, caseStudies] = await Promise.all([
            mongoose.connection
                .collection('insights')
                .find({}, { projection: { slug: 1, _id: 0 } })
                .toArray(),
            mongoose.connection
                .collection('casestudies')
                .find({}, { projection: { slug: 1, _id: 0 } })
                .toArray(),
        ]);

        const insightRoutes = insights
            .filter((i) => i.slug)
            .map((i) => ({
                url:             `${BASE_URL}/blog/${i.slug}`,
                lastModified:    new Date(),
                changeFrequency: 'monthly',
                priority:        0.7,
            }));

        const caseStudyRoutes = caseStudies
            .filter((c) => c.slug)
            .map((c) => ({
                url:             `${BASE_URL}/project/${c.slug}`,
                lastModified:    new Date(),
                changeFrequency: 'monthly',
                priority:        0.8,
            }));

        return [...staticRoutes, ...insightRoutes, ...caseStudyRoutes];
    } catch (err) {
        // If DB is unreachable at build time, fall back to static-only sitemap
        console.error('[sitemap] MongoDB error:', err.message);
        return staticRoutes;
    }
}

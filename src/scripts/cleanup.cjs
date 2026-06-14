// cleanup.cjs — removes test insight records that have Cloudinary coverImages
// Run with: node src/scripts/cleanup.cjs

const { MongoClient } = require('mongodb');

const MONGODB_URI =
    'mongodb://drewadmin:Drew2025@ac-gutl7ba-shard-00-00.mdlqwc3.mongodb.net:27017,ac-gutl7ba-shard-00-01.mdlqwc3.mongodb.net:27017,ac-gutl7ba-shard-00-02.mdlqwc3.mongodb.net:27017/drewdb?replicaSet=atlas-12r7hc-shard-0&authSource=admin&retryWrites=true&w=majority&ssl=true';

async function cleanup() {
    const client = new MongoClient(MONGODB_URI);
    try {
        await client.connect();
        console.log('✓ Connected to MongoDB');

        const db = client.db('drewdb');
        const insights = db.collection('insights');

        // Find all docs with Cloudinary coverImages so we can log them
        const toDelete = await insights
            .find({ coverImage: { $regex: '^https://res.cloudinary.com' } })
            .toArray();

        if (toDelete.length === 0) {
            console.log('✓ No Cloudinary-URL insights found — nothing to delete.');
        } else {
            console.log(`Found ${toDelete.length} insight(s) with Cloudinary coverImage:`);
            toDelete.forEach((doc) =>
                console.log(`  • "${doc.title}" — ${doc.coverImage}`)
            );

            const result = await insights.deleteMany({
                coverImage: { $regex: '^https://res.cloudinary.com' },
            });
            console.log(`✓ Deleted ${result.deletedCount} insight(s).`);
        }
    } catch (err) {
        console.error('✗ Error:', err.message);
        process.exit(1);
    } finally {
        await client.close();
        console.log('✓ Connection closed.');
    }
}

cleanup();

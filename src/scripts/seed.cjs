// seed.cjs — seeds placeholder team members into the 'teams' collection
// Run with: node src/scripts/seed.cjs

const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI =
    'mongodb://drewadmin:Drew2025@ac-gutl7ba-shard-00-00.mdlqwc3.mongodb.net:27017,ac-gutl7ba-shard-00-01.mdlqwc3.mongodb.net:27017,ac-gutl7ba-shard-00-02.mdlqwc3.mongodb.net:27017/drewdb?replicaSet=atlas-12r7hc-shard-0&authSource=admin&retryWrites=true&w=majority&ssl=true';

const TEAM_MEMBERS = [
    {
        name:     'Daniel Mwangi',
        role:     'Strategy Director',
        image:    '/assets/images/home-two/team-thu.png',
        facebook: '',
        twitter:  '',
        linkedin: '',
        order:    1,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name:     'Amina Odhiambo',
        role:     'Brand Strategist',
        image:    '/assets/images/home-two/team-thu.png',
        facebook: '',
        twitter:  '',
        linkedin: '',
        order:    2,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name:     'Kevin Kariuki',
        role:     'Growth Analyst',
        image:    '/assets/images/home-two/team-thu.png',
        facebook: '',
        twitter:  '',
        linkedin: '',
        order:    3,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name:     'Lilian Wanjiru',
        role:     'Communications Lead',
        image:    '/assets/images/home-two/team-thu.png',
        facebook: '',
        twitter:  '',
        linkedin: '',
        order:    4,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

async function seed() {
    const client = new MongoClient(MONGODB_URI);
    try {
        await client.connect();
        console.log('✓ Connected to MongoDB');

        const db    = client.db('drewdb');
        const teams = db.collection('teams');

        // Avoid duplicates — only insert names that don't already exist
        let inserted = 0;
        for (const member of TEAM_MEMBERS) {
            const exists = await teams.findOne({ name: member.name });
            if (exists) {
                console.log(`  · Skipping "${member.name}" — already exists`);
            } else {
                await teams.insertOne(member);
                console.log(`  ✓ Inserted "${member.name}"`);
                inserted++;
            }
        }

        const total = await teams.countDocuments();
        console.log(`\n✓ Done. Inserted ${inserted} new member(s). Total in teams: ${total}`);
    } catch (err) {
        console.error('✗ Error:', err.message);
        process.exit(1);
    } finally {
        await client.close();
        console.log('✓ Connection closed.');
    }
}

seed();

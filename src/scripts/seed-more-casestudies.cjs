'use strict';

const { MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');

function loadEnv() {
    const envPath = path.join(__dirname, '../../.env.local');
    if (!fs.existsSync(envPath)) throw new Error('.env.local not found');
    fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
        const t = line.trim();
        if (!t || t.startsWith('#')) return;
        const eq = t.indexOf('=');
        if (eq === -1) return;
        const k = t.slice(0, eq).trim();
        const v = t.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
        process.env[k] = v;
    });
}

function slug(title) {
    return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const studies = [
    {
        title: 'How Naivas Supermarket Recaptured Urban Shoppers',
        client: 'Naivas Supermarket',
        industry: 'Retail',
        coverImage: 'https://picsum.photos/seed/naivas-retail/800/600',
        featured: true,
        problem: 'Naivas was losing urban middle-class shoppers to premium competitors despite broader product range and competitive pricing, resulting in a 12% decline in basket size over 18 months.',
        insight: 'Research revealed urban shoppers weren\'t abandoning Naivas for price reasons — they perceived the in-store experience as "mass market" and preferred competitors\' curated feel even when paying more.',
        strategy: 'Reposition select urban branches as "smart value" destinations: same Naivas savings, elevated presentation. Launch a targeted digital campaign aimed at value-conscious urban professionals.',
        execution: 'Redesigned in-store merchandising for 8 flagship urban stores. Launched social campaign "Your Budget, Your Standards" with influencer partnerships. Ran 6-week email nurture targeting lapsed loyalty card holders.',
        results: 'Basket size in target stores increased 18% in 90 days. Loyalty card reactivations up 34%. Two flagship stores posted highest monthly revenue in brand history.',
    },
    {
        title: 'Scaling Fintech Trust: Mpesa Agent Network Expansion',
        client: 'Confidential Fintech Partner',
        industry: 'Technology',
        coverImage: 'https://picsum.photos/seed/mpesa-tech/800/600',
        featured: true,
        problem: 'A fintech startup had a superior mobile money product but struggled with agent network distrust in semi-urban areas. Adoption stalled at 22% of projected targets after 6 months.',
        insight: 'Community trust proxies (local leaders, church networks, schools) were the actual gatekeepers for financial product adoption — not price or features.',
        strategy: 'Shift from digital acquisition to community-first field marketing. Partner with community anchor institutions to drive trial. Build agent pride programme to improve word-of-mouth.',
        execution: 'Deployed 40-person field team across 12 semi-urban zones. Ran "Community Champion" agent certification programme. Co-hosted financial literacy events with local partners over 10 weeks.',
        results: 'Agent network grew from 340 to 1,200 in 14 weeks. Transaction volume up 280%. Net Promoter Score for agents rose from 31 to 67.',
    },
    {
        title: 'Equity Bank SME Portfolio Growth Campaign',
        client: 'Equity Bank Kenya',
        industry: 'Financial Services',
        coverImage: 'https://picsum.photos/seed/equity-finance/800/600',
        featured: true,
        problem: 'Equity Bank\'s SME loan products were underperforming in the manufacturing and agri-processing segments despite competitive rates, with application-to-disbursement conversions below 30%.',
        insight: 'SME owners viewed the loan application process as designed for large corporates — too complex, too formal, too slow. Trust was high but perceived friction was the barrier.',
        strategy: 'Simplify the perceived journey through content marketing and peer success stories. Position loan officers as business advisors, not just credit reviewers. Reduce drop-off with proactive follow-up sequences.',
        execution: 'Produced 24-episode "Biashara Blueprint" video series featuring real SME success stories. Trained 60 loan officers in consultative selling. Deployed WhatsApp-based application status updates to reduce perceived wait time.',
        results: 'Application-to-disbursement conversion improved from 28% to 51%. SME loan portfolio grew KES 2.1B in 6 months. "Biashara Blueprint" reached 480,000 views organically.',
    },
    {
        title: 'Nairobi Women\'s Hospital Patient Acquisition Strategy',
        client: 'Nairobi Women\'s Hospital',
        industry: 'Healthcare',
        coverImage: 'https://picsum.photos/seed/nwh-health/800/600',
        featured: false,
        problem: 'NWH was receiving strong inbound referrals but struggling with self-referral acquisition, especially for elective procedures in the maternal and wellness categories among women 28–45.',
        insight: 'Target patients trusted peer recommendations above all but had no trusted digital peer community to consult. They relied on WhatsApp groups and Facebook communities for healthcare decisions.',
        strategy: 'Build genuine presence in women\'s digital communities. Replace promotional messaging with education-first content positioning NWH as a knowledge partner. Create referral loop with existing patients.',
        execution: 'Launched "Her Health Hub" — a content platform across Instagram, Facebook, and WhatsApp. Partnered with 15 women\'s community influencers. Built patient ambassador programme with 50 volunteer stories.',
        results: 'Self-referral appointments grew 43% in 4 months. Social media following grew from 12K to 89K. Patient ambassador programme generated 1,200 qualified referrals in Year 1.',
    },
    {
        title: 'Sarova Hotels Domestic Tourism Recovery Post-COVID',
        client: 'Sarova Hotels & Resorts',
        industry: 'Hospitality',
        coverImage: 'https://picsum.photos/seed/sarova-hotel/800/600',
        featured: false,
        problem: 'Sarova\'s properties were operating at 31% occupancy as domestic tourism recovery stalled. Internal perception held that Kenyan travellers wouldn\'t pay premium hotel rates.',
        insight: 'Domestic travellers weren\'t price-resistant — they were experience-unaware. Most had never considered Sarova as a domestic getaway option because the brand was mentally coded as "for foreigners".',
        strategy: 'Reframe Sarova as a "local luxury" destination through a campaign targeting urban Kenyan families and couples. Make the domestic experience feel aspirational and attainable simultaneously.',
        execution: 'Launched "Treat Yourself Kenya" campaign across digital and OOH in Nairobi CBD. Created weekend-getaway packages with transparent inclusive pricing. Partnered with 8 travel content creators for authentic Kenyan traveller POV.',
        results: 'Domestic occupancy rose from 31% to 67% in 5 months. Weekend package revenue exceeded KES 80M in the campaign period. NPS from domestic guests averaged 74 vs. 58 pre-campaign.',
    },
    {
        title: 'Optiven Real Estate: Premium Land Sales Digital Funnel',
        client: 'Optiven Group',
        industry: 'Real Estate',
        coverImage: 'https://picsum.photos/seed/optiven-realty/800/600',
        featured: false,
        problem: 'Optiven\'s digital leads were high in volume but low in quality — a 3% conversion rate on 4,000+ monthly enquiries meant sales team bandwidth was spent on unqualified prospects.',
        insight: 'High-intent buyers needed extensive education before they were sales-ready. Current lead capture was triggering sales calls too early, causing friction and distrust.',
        strategy: 'Build a staged nurture system that educates before selling. Score leads by behaviour (content consumed, video watched, calculators used). Only route high-intent leads to sales.',
        execution: 'Built 5-stage email nurture sequence with educational content on land buying in Kenya. Created ROI calculator tool driving 3x engagement vs. standard landing pages. Integrated lead scoring with CRM for automatic routing.',
        results: 'Lead-to-site-visit conversion improved from 3% to 11%. Sales team workload on unqualified leads reduced 60%. Monthly qualified pipeline value grew KES 1.4B.',
    },
];

async function main() {
    loadEnv();
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not found in .env.local');

    const dbMatch = uri.match(/\/([^/?]+)(\?|$)/);
    const dbName  = process.env.MONGODB_DB || (dbMatch ? dbMatch[1] : 'drewdb');

    console.log(`Connecting to MongoDB (${dbName}) …`);
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const col = client.db(dbName).collection('casestudies');

        let inserted = 0;
        let skipped  = 0;

        for (const study of studies) {
            const docSlug = slug(study.title);
            const exists = await col.findOne({ slug: docSlug });
            if (exists) {
                console.log(`  ⏭  Already exists: "${study.title}"`);
                skipped++;
                continue;
            }
            await col.insertOne({
                ...study,
                slug: docSlug,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log(`  ✅ Inserted [${study.industry}]: "${study.title}"`);
            inserted++;
        }

        console.log(`\nDone! ${inserted} inserted, ${skipped} already existed.`);
    } finally {
        await client.close();
    }
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });

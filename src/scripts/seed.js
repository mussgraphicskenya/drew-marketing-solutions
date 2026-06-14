const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const solutions = [
  {
    title: "Market Intelligence & Strategy",
    headline: "We use research and data to identify your clearest growth path.",
    body: "Before we build anything, we study your market, your competitors, and your audience.",
    includes: ["Market Research", "Competitor Analysis", "Audience Profiling", "Growth Mapping"],
    icon: "/assets/images/service1.png",
    order: 1
  },
  {
    title: "Brand Positioning & Narrative Design",
    headline: "We define how your brand is understood not just seen.",
    body: "We craft the story, language, and positioning that makes your brand instantly recognizable.",
    includes: ["Brand Strategy", "Messaging Framework", "Visual Identity", "Brand Voice"],
    icon: "/assets/images/service2.png",
    order: 2
  },
  {
    title: "Demand Generation Systems",
    headline: "We build systems that attract, nurture and convert the right audience.",
    body: "We design end-to-end demand generation systems that fill your pipeline with qualified leads.",
    includes: ["Lead Generation", "Content Marketing", "Email Systems", "Funnel Design"],
    icon: "/assets/images/service3.png",
    order: 3
  },
  {
    title: "Experiential & Media Integration",
    headline: "Your brand showing up strategically across every relevant channel.",
    body: "We plan and execute integrated media strategies combining digital and traditional channels.",
    includes: ["Event Marketing", "Media Planning", "Digital Advertising", "PR Integration"],
    icon: "/assets/images/service4.png",
    order: 4
  },
  {
    title: "Growth & Conversion Optimization",
    headline: "Every marketing effort tied to measurable business outcomes.",
    body: "We continuously analyze, test, and optimize your marketing performance.",
    includes: ["Performance Analytics", "A/B Testing", "CRO", "Reporting Dashboards"],
    icon: "/assets/images/feature5.png",
    order: 5
  }
];

const testimonials = [
  {
    name: "Sarah Mwangi",
    role: "CEO",
    company: "Retail Brand",
    quote: "Drew didn't just run campaigns. They rebuilt how we communicate and our sales followed.",
    image: "/assets/images/testi4.png",
    featured: true
  },
  {
    name: "James Otieno",
    role: "Founder",
    company: "Tech Startup",
    quote: "For the first time our marketing actually aligned with our business goals. Real results.",
    image: "/assets/images/testi5.png",
    featured: true
  },
  {
    name: "Amina Hassan",
    role: "MD",
    company: "Financial Services",
    quote: "Strategy before spend. That mindset changed everything for our brand in the Kenyan market.",
    image: "/assets/images/testi6.png",
    featured: true
  },
  {
    name: "David Kariuki",
    role: "CMO",
    company: "FMCG Company",
    quote: "Drew understood our audience better than we did. The growth audit alone was worth it.",
    image: "/assets/images/testi5.png",
    featured: false
  }
];

const insights = [
  {
    title: "Why Most Marketing Isn't Working Today",
    slug: "why-most-marketing-isnt-working",
    excerpt: "Most brands don't have a visibility problem. They have an alignment problem.",
    content: "The marketing landscape has shifted. Brands that struggle are not struggling because they lack visibility — they struggle because their marketing is not aligned with their business goals.",
    category: "Marketing Strategy",
    author: "Drew Marketing Solutions",
    coverImage: "/assets/images/inner/blog-grid1.png",
    featured: true
  },
  {
    title: "Visibility Without Strategy Is Costing You",
    slug: "visibility-without-strategy",
    excerpt: "Being everywhere is not the same as being effective.",
    content: "Every shilling spent on marketing without a clear strategy is a shilling wasted. Brands investing heavily in ads with no clear positioning, no defined audience, and no measurable goal will always underperform.",
    category: "Brand Positioning",
    author: "Drew Marketing Solutions",
    coverImage: "/assets/images/inner/blog-grid2.png",
    featured: true
  },
  {
    title: "Building Demand Generation Systems That Work",
    slug: "demand-generation-systems",
    excerpt: "A campaign gets you attention. A system gets you growth.",
    content: "Most marketing teams run campaigns. The best marketing teams build systems. A campaign has a start and end date. A system runs continuously, learning and optimizing as it goes.",
    category: "Digital Marketing",
    author: "Drew Marketing Solutions",
    coverImage: "/assets/images/inner/blog-grid5.png",
    featured: false
  }
];

const caseStudies = [
  {
    title: "Brand Repositioning for a Retail Brand",
    slug: "brand-repositioning-retail",
    client: "Confidential",
    industry: "Retail",
    problem: "Strong product quality but weak brand recognition in a crowded market.",
    insight: "Customers chose competitors because of clearer brand stories, not better products.",
    strategy: "Repositioned the brand around a single clear value proposition.",
    execution: "New brand narrative, visual identity refresh, and 90-day demand generation campaign.",
    results: "43% increase in brand recall, 28% increase in foot traffic within 6 months.",
    coverImage: "/assets/images/inner/case-thumb.png",
    featured: true
  },
  {
    title: "Demand Generation for a Tech Startup",
    slug: "demand-generation-tech-startup",
    client: "Confidential",
    industry: "Technology",
    problem: "Great product but no structured way to generate and convert leads.",
    insight: "Target audience did not know the product existed.",
    strategy: "Built a full demand generation system including content, email, and paid media.",
    execution: "12-week system build including landing pages, email sequences, and paid campaigns.",
    results: "312 qualified leads in 90 days, 23% conversion rate, 8 enterprise contracts closed.",
    coverImage: "/assets/images/inner/case-thumb2.png",
    featured: true
  },
  {
    title: "Market Entry Strategy for Financial Services",
    slug: "market-entry-financial-services",
    client: "Confidential",
    industry: "Financial Services",
    problem: "Established company entering a new market segment with no existing brand presence.",
    insight: "New segment had different trust triggers than their existing customer base.",
    strategy: "Developed segment-specific positioning, channel selection, and phased launch plan.",
    execution: "6-month phased rollout including brand adaptation and stakeholder communications.",
    results: "Successfully captured 12% market share in target segment within first year.",
    coverImage: "/assets/images/inner/case-thumb3.png",
    featured: false
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully');

    await mongoose.connection.collection('solutions').deleteMany({});
    await mongoose.connection.collection('testimonials').deleteMany({});
    await mongoose.connection.collection('insights').deleteMany({});
    await mongoose.connection.collection('casestudies').deleteMany({});
    console.log('Cleared existing data');

    await mongoose.connection.collection('solutions').insertMany(solutions);
    console.log('✅ Solutions seeded');

    await mongoose.connection.collection('testimonials').insertMany(testimonials);
    console.log('✅ Testimonials seeded');

    await mongoose.connection.collection('insights').insertMany(insights);
    console.log('✅ Insights seeded');

    await mongoose.connection.collection('casestudies').insertMany(caseStudies);
    console.log('✅ Case Studies seeded');

    console.log('🎉 Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
}

seed();
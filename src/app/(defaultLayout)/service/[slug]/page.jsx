import { unstable_noStore as noStore } from 'next/cache';
import BreadCumb from '@/app/Components/Common/BreadCumb';
import Image from 'next/image';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function generateMetadata({ params }) {
    await connectDB();
    const item = await mongoose.connection
        .collection('solutions')
        .findOne({ slug: params.slug });
    if (!item) return { title: 'Solution Not Found' };
    return {
        title:       `${item.title} | Drew Marketing Solutions`,
        description: item.headline,
        openGraph: {
            title:       item.title,
            description: item.headline,
            url:         `https://www.drewmarketingsolutions.com/service/${item.slug}`,
            images:      item.image ? [{ url: item.image, width: 1200, height: 630, alt: item.title }] : [],
        },
        twitter: {
            card:        'summary_large_image',
            title:       item.title,
            description: item.headline,
            images:      item.image ? [item.image] : [],
        },
    };
}

const SolutionDetailPage = async ({ params }) => {
    noStore();
    await connectDB();

    const [item, otherSolutions] = await Promise.all([
        mongoose.connection
            .collection('solutions')
            .findOne({ slug: params.slug }),
        mongoose.connection
            .collection('solutions')
            .find({ slug: { $ne: params.slug } })
            .sort({ order: 1 })
            .limit(5)
            .toArray(),
    ]);

    if (!item) {
        return (
            <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '20px' }}>Solution not found</h2>
                <Link href="/service" style={{ color: '#ff3b00', fontWeight: 600 }}>
                    ← Back to All Solutions
                </Link>
            </div>
        );
    }

    const includes = Array.isArray(item.includes) ? item.includes : [];

    return (
        <div className="project-detail">
            <BreadCumb Title={item.title}></BreadCumb>

            <div className="project-details-area">
                <div className="container">

                    {/* Hero image */}
                    {item.image && (
                        <div className="row">
                            <div className="project-details">
                                <div className="project-details-thumb">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        width={1296}
                                        height={500}
                                        style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main content + Sidebar */}
                    <div className="row" style={{ marginTop: '40px' }}>

                        {/* ── Left: detail content ── */}
                        <div className="col-lg-8">
                            <div className="project-details-content">

                                <h4 className="project-details-title">{item.title}</h4>
                                <p className="project-details-desc">{item.headline}</p>

                                {item.body && (
                                    <p className="project-details-desc" style={{ marginTop: '20px' }}>
                                        {item.body}
                                    </p>
                                )}

                                {/* What's included */}
                                {includes.length > 0 && (
                                    <div className="project-details-list-item" style={{ marginTop: '30px' }}>
                                        <h4>What&apos;s Included</h4>
                                        <ul>
                                            {includes.map((point, i) => (
                                                <li key={i}>
                                                    <i className="bi bi-check-circle-fill"></i>
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* CTA */}
                                <div style={{ marginTop: '40px' }}>
                                    <div className="solutek-btn">
                                        <Link href="/contact">
                                            Book A Strategy Session <i className="bi bi-arrow-right"></i>
                                            <div className="solutek-hover-btn hover-bx"></div>
                                            <div className="solutek-hover-btn hover-bx2"></div>
                                            <div className="solutek-hover-btn hover-bx3"></div>
                                            <div className="solutek-hover-btn hover-bx4"></div>
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* ── Right: sidebar ── */}
                        <div className="col-lg-4">
                            <div className="row">
                                <div className="col-lg-12">

                                    {/* Other solutions list */}
                                    {otherSolutions.length > 0 && (
                                        <div className="widget-sidber">
                                            <div className="widget-sidber-content">
                                                <h4>Other Solutions</h4>
                                            </div>
                                            <div className="widget-category">
                                                <ul>
                                                    {otherSolutions.map((sol, i) => (
                                                        <li key={i}>
                                                            <Link href={sol.slug ? `/service/${sol.slug}` : '/service'}>
                                                                <Image
                                                                    src="/assets/images/inner/category-icon.png"
                                                                    alt="icon"
                                                                    width={19}
                                                                    height={14}
                                                                />
                                                                {sol.title}
                                                                <i className="bi bi-arrow-right"></i>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* Contact widget */}
                                    <div className="widget-sidber-contact-box">
                                        <div className="widget-sidber-contact"></div>
                                        <p className="widget-sidber-contact-text">Call Us Anytime</p>
                                        <h3 className="widget-sidber-contact-number">+254 700 000 000</h3>
                                        <span className="widget-sidber-contact-gmail">
                                            <i className="bi bi-envelope-fill"></i>hello@drewmarketingsolutions.com
                                        </span>
                                        <div className="widget-sidber-contact-btn">
                                            <Link href="/contact">
                                                Book A Session <i className="bi bi-arrow-right"></i>
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SolutionDetailPage;

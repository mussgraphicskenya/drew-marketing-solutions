import { unstable_noStore as noStore } from 'next/cache';
import BreadCumb from '@/app/Components/Common/BreadCumb';
import Image from 'next/image';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import { getCloudinaryUrl } from '@/lib/cloudinaryUrl';
import ServiceFaqAccordion from './ServiceFaqAccordion';

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
            .limit(6)
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

    const includes        = Array.isArray(item.includes) ? item.includes : [];
    const whyDrewTitle   = item.whyDrewTitle   || 'Why Drew?';
    const whyDrewContent = item.whyDrewContent ||
        'We combine sharp strategic thinking with deep local market knowledge to deliver measurable business outcomes — not just deliverables.';

    return (
        <div className="project-detail">
            <BreadCumb Title={item.title}></BreadCumb>

            <div className="services-details-area">
                <div className="container">

                    {/* ── Single row — BOTH columns start flush at the top ── */}
                    <div className="row">

                        {/* ══ LEFT col: hero image first, then content ══ */}
                        <div className="col-lg-8">
                            <div className="row">
                                <div className="col-lg-12">

                                    {/* ── Hero image ── */}
                                    <div
                                        className="services-details-thumb"
                                        style={{
                                            position: 'relative',
                                            width: '100%',
                                            paddingTop: '58.9%',   /* 504/856 × 100 = template aspect ratio */
                                            overflow: 'hidden',
                                            borderRadius: '20px',
                                        }}
                                    >
                                        <Image
                                            src={item.image
                                                ? (getCloudinaryUrl(item.image, 856, 504) || item.image)
                                                : 'https://picsum.photos/seed/svc-detail/856/504'}
                                            alt={item.title}
                                            fill
                                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                                            sizes="(max-width: 992px) 100vw, 66vw"
                                        />
                                    </div>

                                    {/* ── Main text ── */}
                                    <div className="services-details-content">
                                        <h4 className="services-details-title">{item.title}</h4>
                                        <p className="services-details-desc">{item.headline}</p>
                                        {item.body && (
                                            <p className="services-details-desc">{item.body}</p>
                                        )}
                                    </div>

                                    {/* ── What's Included + Why Drew? — two columns ── */}
                                    <div className="row">
                                        {/* Left box: What's Included (dynamic from DB) */}
                                        {includes.length > 0 && (
                                            <div className="col-lg-6 col-md-6">
                                                <div className="service-detalis-text-box">
                                                    <div className="service-details-content">
                                                        <h4>What&apos;s Included</h4>
                                                    </div>
                                                    <div className="service-details-list">
                                                        <ul>
                                                            {includes.map((point, i) => (
                                                                <li key={i}>
                                                                    <i className="bi bi-arrow-right"></i>
                                                                    {point}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Right box: Why Drew? — fully dynamic from DB */}
                                        <div className={includes.length > 0 ? 'col-lg-6 col-md-6' : 'col-lg-12'}>
                                            <div className="service-details-icon-box">
                                                {/* Icon above title — reads whyDrewIcon first, falls back to
                                                    secondBoxIcon for documents seeded before this field existed */}
                                                {(item.whyDrewIcon || item.secondBoxIcon) && (
                                                    <div className="service-det-icon">
                                                        <img
                                                            src={item.whyDrewIcon || item.secondBoxIcon}
                                                            alt=""
                                                            style={{ width: '56px', height: '60px', objectFit: 'contain' }}
                                                        />
                                                    </div>
                                                )}
                                                <div className="service-det-content">
                                                    <h3>{whyDrewTitle}</h3>
                                                    <p>{whyDrewContent}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── Inline FAQ accordion (client component, static content) ── */}
                                    <ServiceFaqAccordion />

                                    {/* ── CTA ── */}
                                    <div style={{ marginTop: '40px', marginBottom: '10px' }}>
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
                        </div>{/* /col-lg-8 */}

                        {/* ══ RIGHT col: sidebar — starts flush with hero image top ══ */}
                        <div className="col-lg-4">
                            <div className="row">
                                <div className="col-lg-12">

                                    {/* Other Solutions widget */}
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

                                    {/* ── Downloads widget — only shown when solution has PDFs ── */}
                                    {item.downloads?.length > 0 && (
                                        <div className="widget-sidber">
                                            <div className="widget-sidber-content">
                                                <h4>Downloads</h4>
                                            </div>
                                            <div className="widget-sidber-download-button">
                                                {item.downloads.map((doc, i) => {
                                                    // Build a safe filename: "Solution-Overview.pdf"
                                                    const safeTitle = (doc.title || 'Download')
                                                        .replace(/[^a-zA-Z0-9\s&-]/g, '')
                                                        .trim()
                                                        .replace(/\s+/g, '-');
                                                    const filename = safeTitle.endsWith('.pdf')
                                                        ? safeTitle
                                                        : `${safeTitle}.pdf`;

                                                    // Ensure URL itself ends in .pdf (fixes .crdownload issue)
                                                    const href = doc.fileUrl?.endsWith('.pdf')
                                                        ? doc.fileUrl
                                                        : `${doc.fileUrl}.pdf`;

                                                    return (
                                                        <a
                                                            key={i}
                                                            href={href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            download={filename}
                                                            className={i === 0 ? '' : 'active'}
                                                        >
                                                            <i className="bi bi-file-earmark-pdf"></i>
                                                            {doc.title || 'Download'}
                                                            <span><i className="bi bi-download"></i></span>
                                                        </a>
                                                    );
                                                })}
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
                                            <Link href="/contact">Book A Session <i className="bi bi-arrow-right"></i></Link>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>{/* /col-lg-4 */}

                    </div>{/* /row */}
                </div>
            </div>
        </div>
    );
};

export default SolutionDetailPage;

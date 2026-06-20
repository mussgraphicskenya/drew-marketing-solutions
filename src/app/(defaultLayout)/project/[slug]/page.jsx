import BreadCumb from "@/app/Components/Common/BreadCumb";
import Image from "next/image";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import { getCloudinaryUrl } from '@/lib/cloudinaryUrl';

export async function generateMetadata({ params }) {
    await connectDB();
    const item = await mongoose.connection
        .collection('casestudies')
        .findOne({ slug: params.slug });
    if (!item) return { title: 'Case Study Not Found' };
    return {
        title:       item.title,
        description: item.problem,
        openGraph: {
            title:       `${item.title} | Case Study`,
            description: item.problem,
            url:         `https://www.drewmarketingsolutions.com/project/${item.slug}`,
            images:      item.coverImage ? [{ url: item.coverImage, width: 1200, height: 630, alt: item.title }] : [],
        },
        twitter: {
            card:        'summary_large_image',
            title:       item.title,
            description: item.problem,
            images:      item.coverImage ? [item.coverImage] : [],
        },
    };
}

const CaseStudyPage = async ({ params }) => {
    await connectDB();
    const item = await mongoose.connection
        .collection("casestudies")
        .findOne({ slug: params.slug });

    if (!item) {
        return (
            <div className="container" style={{ padding: "100px 0" }}>
                Case study not found.
            </div>
        );
    }

    // Split execution string into bullet sentences (split on ". " or ".")
    const executionItems = item.execution
        ? item.execution
              .split(/\.\s+/)
              .map((s) => s.replace(/\.$/, "").trim())
              .filter(Boolean)
        : [];

    const InfoBox = [
        { title: "Client",   info: item.client },
        { title: "Industry", info: item.industry },
        { title: "Location", info: "Nairobi, Kenya" },
        { title: "Agency",   info: "Drew Marketing Solutions" },
    ];

    const Services = [
        "Market Intelligence",
        "Brand Positioning",
        "Demand Generation",
        "Media Integration",
        "Growth Optimization",
    ];

    return (
        <div className="project-detail">
            <BreadCumb Title={item.title}></BreadCumb>
            <div className="project-details-area">
                <div className="container">
                    <div className="row">
                        <div className="project-details">
                            <div className="project-details-thumb" style={{ position: 'relative', width: '100%', paddingTop: '51.9%', overflow: 'hidden', borderRadius: '20px' }}>
                                <Image
                                    src={item.coverImage || '/assets/images/inner/project-det-thu.png'}
                                    alt={item.title}
                                    fill
                                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                                    sizes="100vw"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row project-box-info">
                        {InfoBox.map((box, i) => (
                            <div key={i} className="col-lg-3 col-md-3">
                                <div className="project-details-box">
                                    <p>{box.title}</p>
                                    <h6>{box.info}</h6>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="project-details-content">
                                        <h4 className="project-details-title">Here To Know About This Project</h4>

                                        <p className="project-details-desc">{item.problem}</p>

                                        <p className="project-details-desc">{item.insight}</p>

                                        <div className="project-det-title">
                                            <h3>The Strategy</h3>
                                        </div>
                                        <p className="project-det-desc">{item.strategy}</p>
                                    </div>
                                    <div className="row align-items-center">
                                        <div className="col-lg-6">
                                            {item.secondaryImage ? (
                                                <div className="project-details-item-images" style={{ position: 'relative', width: '100%', paddingTop: '68.3%', overflow: 'hidden', borderRadius: '20px' }}>
                                                    <Image
                                                        src={getCloudinaryUrl(item.secondaryImage, 416, 284) || item.secondaryImage}
                                                        alt={`${item.title} – secondary`}
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                        sizes="(max-width: 768px) 100vw, 416px"
                                                    />
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="project-details-list-item">
                                                <h4>Process &amp; Results</h4>
                                                <ul>
                                                    {executionItems.map((point, i) => (
                                                        <li key={i}>
                                                            <i className="bi bi-check-circle-fill"></i>
                                                            {point}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <a className="project-details-text" href="/project">
                                            {item.title}
                                        </a>
                                        <p className="project-details-desc">{item.results}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="widget-sidber">
                                        <div className="widget-sidber-content">
                                            <h4>Our Solutions</h4>
                                        </div>
                                        <div className="widget-category">
                                            <ul>
                                                {Services.map((svc, i) => (
                                                    <li key={i}>
                                                        <Link href="/service">
                                                            <Image src="/assets/images/inner/category-icon.png" alt="img" width={19} height={14} />
                                                            {svc}<i className="bi bi-arrow-right"></i>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="widget-sidber-contact-box">
                                        <div className="widget-sidber-contact">
                                        </div>
                                        <p className="widget-sidber-contact-text">Call Us Anytime</p>
                                        <h3 className="widget-sidber-contact-number">+254 700 000 000</h3>
                                        <span className="widget-sidber-contact-gmail">
                                            <i className="bi bi-envelope-fill"></i>hello@drewmarketingsolutions.com
                                        </span>
                                        <div className="widget-sidber-contact-btn">
                                            <Link href="/contact">Contact Us <i className="bi bi-arrow-right"></i></Link>
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

export default CaseStudyPage;
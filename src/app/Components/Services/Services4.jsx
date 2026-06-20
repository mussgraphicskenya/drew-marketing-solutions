import { unstable_noStore as noStore } from 'next/cache';
import SectionTitle from "../Common/SectionTitle";
import Link from "next/link";
import Image from "next/image";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";

// Inline model — guarded so hot-reload doesn't re-register it
const solutionSchema = new mongoose.Schema(
    {
        title:    { type: String },
        slug:     { type: String },
        headline: { type: String },
        body:     { type: String },
        includes: { type: [String] },
        icon:     { type: String },
        image:    { type: String },
        order:    { type: Number },
    },
    { collection: "solutions" }
);

const Solution =
    mongoose.models.Solution || mongoose.model("Solution", solutionSchema);

// Fallback thumb images — one per slot, cycling with i % 4
const thumbs = [
    '/assets/images/inner/service-thumb1.png',
    '/assets/images/inner/service-thumb2.png',
    '/assets/images/inner/service-thumb3.png',
    '/assets/images/inner/service-thumb4.png',
];

// Single icon file confirmed present in /assets/images/inner/
const FALLBACK_ICON = '/assets/images/inner/service-icon.png';

const Services4 = async () => {
    noStore();
    await connectDB();
    const data = await Solution.find({}).sort({ order: 1 }).lean();

    return (
        <>
            <style>{`
                /* ── Equal-height cards — stretch all cols so cards match tallest ── */
                .sservice-area.style-two .row {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: stretch;
                }
                .sservice-area.style-two [class*="col-"] {
                    display: flex;
                }
                .sservice-area.style-two .single-service-box {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                }
                .sservice-area.style-two .service-content {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    padding: 37px 10px 16px 28px;
                }

                /* ── Thumb: fill card width correctly ── */
                .sservice-area.style-two .service-thumb {
                    overflow: hidden;
                    flex-shrink: 0;
                }
                .sservice-area.style-two .service-thumb img {
                    width: 100%;
                    height: auto;
                    display: block;
                }

                /* ── Icon: flex-centre instead of broken line-height trick ── */
                .sservice-area.style-two .service-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 1;
                }

                /* ── Title: min-height aligns titles across cards ── */
                .sservice-area.style-two h3.service-title {
                    font-size: 20px !important;
                    line-height: 1.35 !important;
                    min-height: 54px;
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 4px !important;
                }

                /* ── Description fills available space between title and button ── */
                .sservice-area.style-two p.service-text {
                    flex: 1;
                    margin-bottom: 15px;
                }

                /* ── READ MORE button always at card bottom ── */
                .sservice-area.style-two .service-btn {
                    margin-top: auto;
                }

                /* ── Desktop: title needs clearance from abs-positioned icon (top:39%) ── */
                @media (min-width: 992px) {
                    .sservice-area.style-two .service-content {
                        padding-top: 50px;
                    }
                    .sservice-area.style-two h3.service-title {
                        margin-top: 45px !important;
                        position: relative;
                        z-index: 1;
                    }
                }
            `}</style>

            <div className="sservice-area style-two">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <div className="section-title text-center">
                                <SectionTitle
                                    SubTitle="OUR SOLUTIONS"
                                    Title={`Solutions built for growth.<br> Not just <span>marketing.</span>`}
                                ></SectionTitle>
                            </div>
                        </div>

                        {data.map((item, i) => (
                            <div key={i} className="col-xl-3 col-lg-4 col-md-6">
                                <div className="single-service-box">

                                    {/* ── Service thumb image — plain img so width:100% applies ── */}
                                    <div className="service-thumb">
                                        <img
                                            src={item.image || thumbs[i % 4]}
                                            alt={item.title || 'service'}
                                            width={306}
                                            height={204}
                                            style={{ width: '100%', height: 'auto', display: 'block' }}
                                        />
                                    </div>

                                    {/* ── Orange circle icon — plain img with invert for white icon ── */}
                                    <div className="service-icon">
                                        <img
                                            src={item.icon || FALLBACK_ICON}
                                            alt="service icon"
                                            width={35}
                                            height={35}
                                            style={{
                                                width: '35px',
                                                height: '35px',
                                                objectFit: 'contain',
                                                filter: 'brightness(0) invert(1)',
                                            }}
                                        />
                                    </div>

                                    {/* ── Text content ── */}
                                    <div className="service-content">
                                        <h3 className="service-title">
                                            <Link href={`/service/${item.slug || '#'}`}>{item.title}</Link>
                                        </h3>
                                        <p className="service-text">{item.headline}</p>
                                        <div className="service-btn">
                                            <Link href={`/service/${item.slug || '#'}`}>
                                                <i className="bi bi-plus"></i> READ MORE
                                            </Link>
                                        </div>
                                        <div className="services-shape bounce-animate-3">
                                            <Image src="/assets/images/inner/serice-shape.png" alt="img" width={18} height={18} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Background decorative shapes — kept as next/image since they are static and fixed-size */}
                    <div className="service-shape bounce-animate3">
                        <Image src="/assets/images/service5.png" alt="img" width={199} height={420} />
                    </div>
                    <div className="service-shape2">
                        <Image src="/assets/images/service7.png" alt="img" width={100} height={100} />
                    </div>
                    <div className="service-shape3 bounce-animate4">
                        <Image src="/assets/images/service8.png" alt="img" width={341} height={351} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Services4;
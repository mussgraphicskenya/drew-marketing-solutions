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

const Services4 = async () => {
    noStore();
    await connectDB();
    const data = await Solution.find({}).sort({ order: 1 }).lean();

    return (
        <>
            <style>{`
                .single-service-box .service-content {
                    padding-top: 60px !important;
                }
                .single-service-box .service-title a {
                    font-size: 15px !important;
                    line-height: 1.3 !important;
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
                                    <div className="service-thumb">
                                        <Image
                                            src={item.image || "/assets/images/inner/service-thumb1.png"}
                                            alt="img"
                                            width={306}
                                            height={204}
                                        />
                                    </div>
                                    <div className="service-icon">
                                        {item.icon && (
                                            <Image src={item.icon} alt="img" width={35} height={35} />
                                        )}
                                    </div>
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
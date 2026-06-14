import { unstable_noStore as noStore } from 'next/cache';
import Image from "next/image";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

const CaseStudy = async () => {
    noStore();
    await connectDB();
    const data = await mongoose.connection.collection("casestudies").find({}).limit(3).toArray();

    return (
        <div className="case-studies-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title text-center">
                            <h6 className="section-sub-title">case studies</h6>
                            <h1 className="section-main-title2">Real problems. Real strategy. Real results.</h1>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {data[0] && (
                    <div className="case-studies-box">
                        <div className="row">
                            <div className="col-lg-6 col-md-6">
                                <div className="single-case-studies-box">
                                    <div className="case-studies-content">
                                        <h4><Link href={`/project/${data[0].slug}`}>{data[0].title}</Link></h4>
                                        <h5>{data[0].industry}</h5>
                                    </div>
                                    <div className="case-studies-btn">
                                        <Link href={`/project/${data[0].slug}`}>view more details</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="case-studies-thumb">
                                    <Image src={data[0].coverImage || '/assets/images/home-3/case-studies.png'} alt={data[0].title || 'Case Study'} width={568} height={424} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                    )}
                    {data[1] && (
                    <div className="col-lg-6">
                        <div className="case-studies-single-box">
                            <div className="case-studies-thumb">
                                <Image src={data[1].coverImage || '/assets/images/home-3/case-studies2.png'} alt={data[1].title || 'Case Study'} width={636} height={454} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                                <div className="case-studie-content">
                                    <h3><Link href={`/project/${data[1].slug}`}>{data[1].title}</Link></h3>
                                    <h6>{data[1].industry}</h6>
                                </div>
                                <div className="case-studies-icon">
                                    <i className="bi bi-arrow-right"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    )}
                    {data[2] && (
                    <div className="col-lg-6">
                        <div className="case-studies-single-box">
                            <div className="case-studies-thumb">
                                <Image src={data[2].coverImage || '/assets/images/home-3/case-studies3.png'} alt={data[2].title || 'Case Study'} width={636} height={454} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                                <div className="case-studie-content">
                                    <h3><Link href={`/project/${data[2].slug}`}>{data[2].title}</Link></h3>
                                    <h6>{data[2].industry}</h6>
                                </div>
                                <div className="case-studies-icon">
                                    <i className="bi bi-arrow-right"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CaseStudy;

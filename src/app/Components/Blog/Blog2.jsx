import { unstable_noStore as noStore } from 'next/cache';
import Link from 'next/link';
import SectionTitle from "../Common/SectionTitle";
import Image from 'next/image';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

const Blog2 = async () => {
    noStore();
    await connectDB();
    const data = await mongoose.connection
        .collection('insights')
        .find({})
        .sort({ createdAt: -1 })
        .limit(3)
        .toArray();

    return (
        <div className="blog-area style-two">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-12">
                        <div className="section-title text-center">
                            <SectionTitle
                                    SubTitle="DREW INSIGHTS"
                                    Title="Fresh Thinking on Brand &amp; <span>Growth Strategy.</span>"
                            ></SectionTitle>
                        </div>
                    </div>
                </div>
                <div className="row">
                {data.map((item, i) => (
                    <div key={i} className="col-lg-4 col-md-6">
                        <div className="single-blog-box">
                            <div className="single-blog-thumb">
                                 <Image
                                    src={item.coverImage || '/assets/images/blog1.png'}
                                    alt={item.title || 'Insight'}
                                    width={416}
                                    height={283}
                                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                />
                                <div className="blog-meta-top">
                                    <Link href={`/blog/${item.slug}`}>{item.category}</Link>
                                </div>
                            </div>
                            <div className="blog-box-content">
                            <div className="meta-blog">
                                <Link href={`/blog/${item.slug}`}><span><i className="bi bi-person"></i>{item.author || 'DREW'}</span></Link>
                                <p><span>
                                <Image src="/assets/images/home-two/mesage-icon.png" alt="img" width={17} height={15}   />
                                    </span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</p>
                                </div>
                                <h3><Link href={`/blog/${item.slug}`}>{item.title}</Link></h3>
                                <div className="blog-button">
                                    <Link href={`/blog/${item.slug}`} className="btn-2">read post</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                </div>
            </div>
        </div>
    );
};

export default Blog2;
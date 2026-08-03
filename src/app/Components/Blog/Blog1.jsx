import { unstable_noStore as noStore } from 'next/cache';
import Link from 'next/link';
import SectionTitle from "../Common/SectionTitle";
import BlogCard1 from "../BlogCard/BlogCard1";
import BlogCardStyle2 from "../BlogCard/BlogCardStyle2";
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import { getCloudinaryUrl } from '@/lib/cloudinaryUrl';

const Blog1 = async () => {
    noStore();
    await connectDB();
    const data = await mongoose.connection
        .collection('insights')
        .find({})
        .sort({ createdAt: -1 })
        .limit(3)
        .toArray();

    // Split: first post goes to BlogCard1 (large), rest to BlogCardStyle2 (side cards)
    const [first, ...rest] = data;

    return (
        <div className="blog-area">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <div className="section-title text-left">
                            <SectionTitle
                                    SubTitle="DREW INSIGHTS"
                                    Title="Fresh Thinking on <br> Brand &amp; <span>Growth Strategy.</span>"
                            ></SectionTitle>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="project-right">
                            <div className="solutek-btn">
                                <Link href="/blog">
                                    VIEW ALL INSIGHTS
                                    <div className="solutek-hover-btn hover-bx"></div>
                                    <div className="solutek-hover-btn hover-bx2"></div>
                                    <div className="solutek-hover-btn hover-bx3"></div>
                                    <div className="solutek-hover-btn hover-bx4"></div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {first && (
                        <div className="col-xl-5 col-lg-6 col-md-6">
                            <BlogCard1
                                BlogImg={getCloudinaryUrl(first.coverImage, 526, 354) || `https://picsum.photos/seed/blog1-${first._id}/526/354`}
                                Title={first.title}
                                Content={first.excerpt || ''}
                                Slug={first.slug}
                            ></BlogCard1>
                        </div>
                    )}
                    <div className="col-xl-7 col-lg-6 col-md-6">
                        {rest.map((item, i) => (
                            <BlogCardStyle2
                                key={i}
                                BlogImg={getCloudinaryUrl(item.coverImage, 301, 260) || `https://picsum.photos/seed/blog2-${item._id}/${i + 1}/301/260`}
                                Title={item.title}
                                Content={item.excerpt || ''}
                                Slug={item.slug}
                            ></BlogCardStyle2>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog1;
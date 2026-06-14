import SectionTitle from "../Common/SectionTitle";
import BlogCard1 from "../BlogCard/BlogCard1";
import BlogCardStyle2 from "../BlogCard/BlogCardStyle2";
import Link from "next/link";

const Blog1 = () => {
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
                    <div className="col-xl-5 col-lg-6 col-md-6">
                        <BlogCard1
                            BlogImg="/assets/images/blog1.png"
                            Title="Why Most Brands Confuse Activity With Strategy."
                            Content="Spending on campaigns without a clear strategic foundation is the fastest way to waste budget and stall growth. Here's how to fix it."
                        ></BlogCard1>
                    </div>
                    <div className="col-xl-7 col-lg-6 col-md-6">
                        <BlogCardStyle2
                             BlogImg="/assets/images/blog2.png"
                             Title="The Alignment Problem: When Marketing and Business Goals Diverge."
                             Content="The most dangerous gap in any growth plan isn't budget — it's misalignment between what marketing does and what the business actually needs."
                        ></BlogCardStyle2>

                        <BlogCardStyle2
                             BlogImg="/assets/images/blog3.png"
                             Title="Demand Generation Isn't Lead Generation. Here's the Difference."
                             Content="Most brands optimise for leads when they should be building demand. Understanding the distinction can transform your pipeline entirely."
                        ></BlogCardStyle2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog1;
import BreadCumb from "@/app/Components/Common/BreadCumb";
import Image from "next/image";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export async function generateMetadata({ params }) {
    await connectDB();
    const item = await mongoose.connection
        .collection('insights')
        .findOne({ slug: params.slug });
    if (!item) return { title: 'Insight Not Found' };
    return {
        title:       item.title,
        description: item.excerpt,
        openGraph: {
            title:       item.title,
            description: item.excerpt,
            url:         `https://www.drewmarketingsolutions.com/blog/${item.slug}`,
            images:      item.coverImage ? [{ url: item.coverImage, width: 1200, height: 630, alt: item.title }] : [],
        },
        twitter: {
            card:        'summary_large_image',
            title:       item.title,
            description: item.excerpt,
            images:      item.coverImage ? [item.coverImage] : [],
        },
    };
}

const BlogDetailPage = async ({ params }) => {
    await connectDB();

    const [item, recentPosts] = await Promise.all([
        mongoose.connection
            .collection("insights")
            .findOne({ slug: params.slug }),
        mongoose.connection
            .collection("insights")
            .find({})
            .sort({ createdAt: -1 })
            .limit(3)
            .toArray(),
    ]);

    if (!item) {
        return (
            <div className="container" style={{ padding: "100px 0" }}>
                Insight not found.
            </div>
        );
    }

    const formattedDate = item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "";

    const Services = [
        "Marketing Strategy",
        "Brand Positioning",
        "Business Growth",
        "Digital Marketing",
        "Thought Leadership",
    ];

    const BlogTag = [
        "Strategy",
        "Branding",
        "Growth",
        "Digital",
        "Marketing",
        "Insights",
    ];

    return (
        <div className="blog-detail">
            <BreadCumb Title={item.title}></BreadCumb>
            <div className="blog-details-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="blog-details-thumb">
                                        <Image src={item.coverImage} alt={item.title} width={856} height={501} />
                                    </div>
                                    <div className="blog-details-content">
                                        <div className="meta-blog">
                                            <span className="mate-text">By {item.author}</span>
                                            <span><i className="bi bi-calendar-check-fill"></i>{formattedDate}</span>
                                            <span>
                                                <Image src="/assets/images/inner/category-icon.png" alt="img" width={19} height={14} />
                                                {item.category}
                                            </span>
                                        </div>
                                        <h4 className="blog-details-title">{item.title}</h4>

                                        <p className="blog-details-desc">{item.excerpt}</p>

                                        <p className="blog-details-desc">{item.content}</p>

                                        <div className="blog-details-author-talk">
                                            <div className="blog-details-quote">
                                                <Image src="/assets/images/testi1.png" alt="img" width={23} height={17} />
                                            </div>
                                            <div className="blog-details-author-title">
                                                <p>{item.excerpt}</p>
                                                <span>{item.author}</span>
                                            </div>
                                        </div>

                                        <h3 className="blog-details-title">Key Takeaways</h3>

                                        <p className="blog-details-desc two">{item.content}</p>

                                        <div className="blog-details-list-item">
                                            <ul>
                                                <li><i className="bi bi-check-circle-fill"></i>Innovate wireless market</li>
                                                <li><i className="bi bi-check-circle-fill"></i>Productivate resource sucking</li>
                                                <li><i className="bi bi-check-circle-fill"></i>Proactively unleash oriented communities</li>
                                                <li><i className="bi bi-check-circle-fill"></i>Credibly develop progressive archi</li>
                                            </ul>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6">
                                                <div className="blog-details-thumb two">
                                                    <Image src="/assets/images/home-two/blog-thu2.png" alt="img" width={379} height={221} />
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6">
                                                <div className="blog-details-thumb">
                                                    <Image src="/assets/images/home-two/blog-thu3.png" alt="img" width={379} height={221} />
                                                </div>
                                            </div>
                                        </div>

                                        <h3 className="blog-details-title two">Arcu At Mauris Facilisis Fermentum</h3>

                                        <p className="blog-details-desc three">{item.content}</p>
                                    </div>
                                    <div className="blog-details-socila-box">
                                        <div className="row align-items-center">
                                            <div className="col-lg-6 col-md-6">
                                                <div className="blog-details-category">
                                                    <span><a href="#">{item.category}</a></span>
                                                    <span><a className="active-className" href="#">Digital Marketing</a></span>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6">
                                                <div className="blog-details-social-icon">
                                                    <ul>
                                                        <li><a href="#"><i className="bi bi-facebook"></i></a></li>
                                                        <li><a href="#"><i className="bi bi-twitter"></i></a></li>
                                                        <li><a href="#"><i className="bi bi-linkedin"></i></a></li>
                                                        <li><a href="#"><i className="bi bi-instagram"></i></a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="single-comment-area">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="blog-details-comment-title">
                                                    <h4>2 Comments</h4>
                                                </div>
                                                <div className="blog-details-comment">
                                                    <div className="blog-details-comment-reply">
                                                        <a href="#">Reply</a>
                                                    </div>
                                                    <div className="blog-details-comment-thumb">
                                                        <Image src="/assets/images/testi4.png" alt="img" width={70} height={70} />
                                                    </div>
                                                    <div className="blog-details-comment-content">
                                                        <h2>Maria Manda</h2>
                                                        <span>22 August, 2024</span>
                                                        <p>Interactively visualize top-line internal or organic sources rather than top-line niche mark
                                                            unleash 24/7 opportunities after high standards in process improvements. Uniquely deploy
                                                            methodologies with reliable information.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="blog-details-comment style-two">
                                                    <div className="blog-details-comment-reply">
                                                        <a href="#">Reply</a>
                                                    </div>
                                                    <div className="blog-details-comment-thumb">
                                                        <Image src="/assets/images/testi5.png" alt="img" width={70} height={70} />
                                                    </div>
                                                    <div className="blog-details-comment-content">
                                                        <h2>Johon Alex</h2>
                                                        <span>22 August, 2024</span>
                                                        <p>Interactively visualize top-line internal or organic sources rather than top-line niche mark
                                                            unleash 24/7 opportunities after high standards in process.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="blog-details-contact">
                                            <div className="blog-details-contact-title">
                                                <h4>Leave A Comments</h4>
                                            </div>
                                            <form action="#">
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="contact-input-box">
                                                            <input type="text" name="Name" placeholder="Full Name*" required="" />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="contact-input-box">
                                                            <input type="text" name="Email" placeholder="Email Address*" required="" />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="contact-input-box">
                                                            <input type="text" name="Web Site" placeholder="Your Website*" required="" />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="contact-input-box">
                                                            <textarea name="Message" id="Meassage" placeholder="Write Comments..."></textarea>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="input-check-box">
                                                            <input type="checkbox" />
                                                            <span>Save your email info in the browser for next comments.</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="blog-details-submi-button">
                                                            <button type="submit">Post Comments</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="widget-sidber">
                                        <div className="widget_search">
                                            <form action="#" method="get">
                                                <input type="text" name="s" value="" placeholder="Search Here" title="Search for:" />
                                                <button type="submit" className="icons">
                                                    <i className="fa fa-search"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="widget-sidber">
                                        <div className="widget-sidber-content">
                                            <h4>Categories</h4>
                                        </div>
                                        <div className="widget-category">
                                            <ul>
                                                {Services.map((svc, i) => (
                                                    <li key={i}>
                                                        <Link href={`/blog?category=${encodeURIComponent(svc)}`}>
                                                            <Image src="/assets/images/inner/category-icon.png" alt="img" width={19} height={14} />
                                                            {svc}<i className="bi bi-arrow-right"></i>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="widget-sidber">
                                        <div className="widget-sidber-content">
                                            <h4>Recent Posts</h4>
                                        </div>
                                        {recentPosts.map((post, i) => (
                                            <div key={i} className="sidber-widget-recent-post">
                                                <div className="recent-widget-thumb">
                                                    <Image
                                                        src={post.coverImage || "/assets/images/inner/recent-post.png"}
                                                        alt="img"
                                                        width={70}
                                                        height={70}
                                                    />
                                                </div>
                                                <div className="recent-widget-content">
                                                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                                    <p>
                                                        {post.createdAt
                                                            ? new Date(post.createdAt).toLocaleDateString("en-US", {
                                                                  month: "short",
                                                                  day: "numeric",
                                                                  year: "numeric",
                                                              })
                                                            : ""}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="widget-sidber">
                                        <div className="widget-sidber-content">
                                            <h4>Tags</h4>
                                        </div>
                                        <div className="widget-catefories-tags">
                                            {BlogTag.map((tag, i) => (
                                                <a href="#" key={i}>{tag}</a>
                                            ))}
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

export default BlogDetailPage;

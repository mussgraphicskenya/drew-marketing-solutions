import BreadCumb from "@/app/Components/Common/BreadCumb";
import Image from "next/image";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import CommentForm from "@/app/Components/Blog/CommentForm";
import { getCloudinaryUrl } from '@/lib/cloudinaryUrl';

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

    const [item, recentPosts, approvedComments] = await Promise.all([
        mongoose.connection
            .collection("insights")
            .findOne({ slug: params.slug }),
        mongoose.connection
            .collection("insights")
            .find({})
            .sort({ createdAt: -1 })
            .limit(3)
            .toArray(),
        mongoose.connection
            .collection("comments")
            .find({ insightSlug: params.slug, approved: true })
            .sort({ createdAt: -1 })
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

    const pageUrl = `https://www.drewmarketingsolutions.com/blog/${item.slug}`;
    const pageTitle = encodeURIComponent(item.title);

    const Services = [
        "Marketing Strategy",
        "Brand Positioning",
        "Business Growth",
        "Digital Marketing",
        "Thought Leadership",
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
                                        <Image src={getCloudinaryUrl(item.coverImage, 856, 501) || '/assets/images/blog1.png'} alt={item.title} width={856} height={501} />
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

                                        {/* Pullquote — only shown when a quote is provided */}
                                        {item.quote && (
                                            <div className="blog-details-author-talk">
                                                <div className="blog-details-quote">
                                                    <Image src="/assets/images/testi1.png" alt="img" width={23} height={17} />
                                                </div>
                                                <div className="blog-details-author-title">
                                                    <p>{item.quote}</p>
                                                    <span>{item.quoteAuthor || item.author}</span>
                                                </div>
                                            </div>
                                        )}


                                        {/* Key Takeaways */}
                                        {item.keyTakeaways && item.keyTakeaways.length > 0 && (
                                            <>
                                                <h3 className="blog-details-title">Key Takeaways</h3>
                                                <div className="blog-details-list-item">
                                                    <ul>
                                                        {item.keyTakeaways.map((point, i) => (
                                                            <li key={i}>
                                                                <i className="bi bi-check-circle-fill"></i>
                                                                {point}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </>
                                        )}

                                        {/* Article Images */}
                                        {item.articleImages && item.articleImages.length > 0 && (
                                            <div className="row">
                                                {item.articleImages.map((imgUrl, i) => (
                                                    <div key={i} className="col-lg-6 col-md-6">
                                                        <div className="blog-details-thumb two">
                                                            <Image src={imgUrl} alt={`Article image ${i + 1}`} width={379} height={221} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Conclusion — shown only when at least one field is populated */}
                                        {(item.conclusionTitle || item.conclusionContent) && (
                                            <div style={{ marginTop: '30px', marginBottom: '20px' }}>
                                                {item.conclusionTitle && (
                                                    <h3 className="blog-details-title two" style={{ marginBottom: '15px' }}>
                                                        {item.conclusionTitle}
                                                    </h3>
                                                )}
                                                {item.conclusionContent && (
                                                    <p className="blog-details-desc three">
                                                        {item.conclusionContent}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Social share + tags */}

                                    <div className="blog-details-socila-box">
                                        <div className="row align-items-center">
                                            <div className="col-lg-6 col-md-6">
                                                <div className="blog-details-category">
                                                    {item.tags && item.tags.length > 0 ? (
                                                        item.tags.map((tag, i) => (
                                                            <span key={i}>
                                                                <a
                                                                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                                                                    className={i === 0 ? '' : 'active-className'}
                                                                >
                                                                    {tag}
                                                                </a>
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span><a href="#">{item.category}</a></span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6">
                                                <div className="blog-details-social-icon">
                                                    <ul>
                                                        <li>
                                                            <a
                                                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                aria-label="Share on Facebook"
                                                            >
                                                                <i className="bi bi-facebook"></i>
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${pageTitle}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                aria-label="Share on Twitter"
                                                            >
                                                                <i className="bi bi-twitter"></i>
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                aria-label="Share on LinkedIn"
                                                            >
                                                                <i className="bi bi-linkedin"></i>
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                href={`https://wa.me/?text=${pageTitle}%20${encodeURIComponent(pageUrl)}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                aria-label="Share on WhatsApp"
                                                            >
                                                                <i className="bi bi-whatsapp"></i>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Comments section */}
                                    <div className="single-comment-area">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="blog-details-comment-title">
                                                    <h4>
                                                        {approvedComments.length}{" "}
                                                        {approvedComments.length === 1 ? "Comment" : "Comments"}
                                                    </h4>
                                                </div>

                                                {approvedComments.map((c, i) => (
                                                    <div
                                                        key={String(c._id)}
                                                        className={`blog-details-comment${i > 0 ? " style-two" : ""}`}
                                                    >
                                                        <div className="blog-details-comment-thumb">
                                                            <Image
                                                                src="/assets/images/testi4.png"
                                                                alt="commenter"
                                                                width={70}
                                                                height={70}
                                                            />
                                                        </div>
                                                        <div className="blog-details-comment-content">
                                                            <h2>{c.name}</h2>
                                                            <span>
                                                                {c.createdAt
                                                                    ? new Date(c.createdAt).toLocaleDateString("en-US", {
                                                                          day: "numeric",
                                                                          month: "long",
                                                                          year: "numeric",
                                                                      })
                                                                    : ""}
                                                            </span>
                                                            <p>{c.comment}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Comment submission form (client component) */}
                                        <CommentForm insightSlug={params.slug} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
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
                                            {(item.tags && item.tags.length > 0
                                                ? item.tags
                                                : ["Strategy", "Branding", "Growth", "Digital", "Marketing", "Insights"]
                                            ).map((tag, i) => (
                                                <a href={`/blog?tag=${encodeURIComponent(tag)}`} key={i}>{tag}</a>
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

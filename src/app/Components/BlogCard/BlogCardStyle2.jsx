import Link from "next/link";

const BlogCardStyle2 = ({ BlogImg, Title, Content }) => {
    return (
        <div className="blog-singele-box-tow">
            {/* Responsive flex container:
                - Mobile (< 576px): column — image stacks on top of text
                - Desktop (≥ 576px): row — image left, text right
                Achieved with a CSS class injected via a <style> tag so we
                avoid Tailwind / media-query-in-JS complications.           */}
            <style>{`
                .bcs2-wrap {
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                .bcs2-thumb {
                    width: 100%;
                    height: 220px;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                .bcs2-thumb img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .bcs2-content {
                    padding: 22px 20px 18px;
                    flex: 1;
                }
                @media (min-width: 576px) {
                    .bcs2-wrap {
                        flex-direction: row;
                        align-items: stretch;
                    }
                    .bcs2-thumb {
                        width: 301px;
                        height: auto;
                        min-height: 260px;
                    }
                    .bcs2-content {
                        padding: 26px 24px 20px;
                    }
                }
            `}</style>

            <div className="bcs2-wrap">
                {/* Image */}
                <div className="bcs2-thumb">
                    <img
                        src={BlogImg || '/assets/images/blog2.png'}
                        alt={Title || 'Blog post'}
                    />
                </div>

                {/* Text content — all original classNames preserved */}
                <div className="blog-content-tow bcs2-content">
                    <div className="blog-date-tow">
                        <h4>
                            <i className="bi bi-calendar2-check"></i>Drew Insights{' '}
                            <span><i className="bi bi-chat-left-text"></i>Strategy</span>
                        </h4>
                    </div>
                    <h3 className="blog-title-two">
                        <Link href="/blog">{Title}</Link>
                    </h3>
                    <p className="blog-tex-tow">{Content}</p>
                    <div className="blog-btn-tow">
                        <Link href="/blog">READ MORE<i className="bi bi-arrow-right"></i></Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogCardStyle2;
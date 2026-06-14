import Image from "next/image";
import Link from "next/link";

const BlogCardStyle2 = ({BlogImg, Title, Content}) => {
    return (
        <div className="blog-singele-box-tow">
            <div className="blog-content-tow" style={{ display: 'flex', gap: '0', alignItems: 'stretch', padding: '0', overflow: 'hidden' }}>
                <div className="blog-thumb-tow" style={{ float: 'none', margin: '0', flexShrink: 0, width: '301px', height: '312px', overflow: 'hidden' }}>
                    <Image
                        src={BlogImg}
                        alt="img"
                        width={301}
                        height={312}
                        style={{ objectFit: 'cover', minWidth: '301px', display: 'block' }}
                    />
                </div>
                <div style={{ padding: '26px 24px 20px', flex: 1 }}>
                    <div className="blog-date-tow">
                        <h4><i className="bi bi-calendar2-check"></i>Drew Insights <span><i className="bi bi-chat-left-text"></i>Strategy</span></h4>
                    </div>
                    <h3 className="blog-title-two"><Link href="/blog">{Title}</Link></h3>
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
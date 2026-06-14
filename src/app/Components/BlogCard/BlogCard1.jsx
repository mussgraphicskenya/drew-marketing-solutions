import Image from "next/image";
import Link from "next/link";

const BlogCard1 = ({BlogImg, Title, Content}) => {
    return (
        <div className="blog-singele-box">
            <div className="blog-thumb">
                <Image
                    src={BlogImg}
                    alt="img"
                    width={526}
                    height={354}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />
            </div>
            <div className="blog-content">
                <div className="blog-date">
                    <h4><i className="bi bi-calendar2-check"></i>Drew Insights <span><i className="bi bi-chat-left-text"></i>Strategy</span></h4>
                </div>
                <h3 className="blog-title"><Link href="/blog">{Title}</Link></h3>
                <p className="blog-tex">{Content}</p>
                <div className="blog-btn">
                    <Link href="/blog">READ MORE<i className="bi bi-arrow-right"></i></Link>
                </div>
            </div>
        </div>
    );
};

export default BlogCard1;
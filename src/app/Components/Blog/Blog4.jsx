import Link from 'next/link';
import data from '../../Data/blog.json';
import Image from 'next/image';

const Blog4 = () => {

    const Services = [
        'Database Security',
        'IT Solution',
        'Technology Consult',
        'App Development',
        'UI/UX Design',
        'Cyber Security',
      ]; 

      const BlogTag = [
        'Cyber Security',
        'Learning',
        'Software',
        'Development',
        'Marketing',
        'Technology',
      ]; 

    return (
        <div className="blog-area style-grid">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="row">
                        {data.map((item, i) => (
                            <div key={i} className="col-lg-6 col-md-6">
                                <div className="single-blog-box">
                                    <div className="single-blog-thumb">
                                        <Image src={item.img} alt="img" width={364} height={248}   />
                                    </div>
                                    <div className="blog-box-content">
                                    <div className="meta-blog">
                                        <Link href={`/blog/${item.slug}`}><span><i className="bi bi-person-plus"></i>By {item.author}</span></Link>
                                        <p><span>
                                            <Image src="/assets/images/inner/grid-calen.png" alt="img" width={14} height={14}   />
                                            </span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</p>
                                        </div>
                                        <h3><Link href={`/blog/${item.slug}`}>{item.title}
                                        </Link></h3>
                                        <div className="blog-button">
                                            <Link href={`/blog/${item.slug}`}>READ MORE<i className="bi bi-arrow-right"></i></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ))}

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
                                        <h4>Main Services</h4>
                                    </div>
                                    <div className="widget-category">
                                        <ul>
                                        {Services.map((item, i) => (
                                            <li key={i}><Link href="/service/service-details">
                                                <Image src="/assets/images/inner/category-icon.png" alt="img" width={19} height={14}   />
                                                {item}<i className="bi bi-arrow-right"></i></Link></li>
                                        ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="widget-sidber">
                                    <div className="widget-sidber-content">
                                        <h4>Popular Post</h4>
                                    </div>
                                    <div className="sidber-widget-recent-post">
                                        <div className="recent-widget-thumb">
                                           <Image src="/assets/images/inner/recent-post.png" alt="img" width={80} height={80}   />
                                        </div>
                                        <div className="recent-widget-content">
                                            <Link href="/blog">Supervisor Disapproved Of Latest Work.
                                            </Link>
                                            <p> feb, 26 2024</p>							
                                        </div>
                                    </div>							
                                    <div className="sidber-widget-recent-post">
                                        <div className="recent-widget-thumb">
                                            <Image src="/assets/images/inner/recent-post2.png" alt="img" width={80} height={80}   />
                                        </div>
                                        <div className="recent-widget-content">
                                        <Link href="/blog">Simplify Streamline Succeed IT Solutions</Link>
                                            <p> June, 15 2024</p>							
                                        </div>
                                    </div>							
                                    <div className="sidber-widget-recent-post">
                                        <div className="recent-widget-thumb">
                                             <Image src="/assets/images/inner/recent-post3.png" alt="img" width={80} height={80}   />
                                        </div>
                                        <div className="recent-widget-content">
                                        <Link href="/blog">Unlocking Potential Through Technology</Link>
                                            <p> april, 10 2024</p>							
                                        </div>
                                    </div>
                                </div>						
                                <div className="widget-sidber">
                                    <div className="widget-sidber-content">
                                        <h4>Tags</h4>
                                    </div>	
                                    <div className="widget-catefories-tags">
                                    {BlogTag.map((item, i) => (
                                        <a href="#" key={i}>{item}</a>
                                    ))}
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

export default Blog4;
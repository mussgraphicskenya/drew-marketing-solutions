import Image from "next/image";
import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

const Footer = () => {

    const Services = [
        'Market Intelligence',
        'Brand Positioning',
        'Demand Generation',
        'Media Integration',
        'Growth Optimization',
      ];

      const UsefulLinks = [
        {title:'About Drew', link:'/about'},
        {title:'Our Solutions', link:'/service'},
        {title:'Case Studies', link:'/project'},
        {title:'Insights', link:'/blog'},
        {title:'Contact Us', link:'/contact'}
      ];  

      const LogoContent = {
        img1:'/assets/images/footer-logo.png',
        Content:'Strategic growth partner for businesses ready to grow. We align your marketing to your business goals.'
      }

      const NewsletterContent = {
            Content:'Get strategic marketing insights delivered to your inbox. No fluff. Just clarity.'
      }

      const AdressContent = {
        Title:'Ready to Grow the Right Way?',
        Number:'+254 700 000 000'
      }

    return (
        <div className="footer_main_area">
            <div className="address-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-12">
                            <div className="address-box">
                                <div className="address-icon">
                                    <Image src="/assets/images/address1.png" alt="img" width={35} height={35}   />
                                </div>
                                <div className="address-title">
                                    <h3>{AdressContent.Title}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12">
                            <div className="address-box2">
                                <div className="address-icon">
                                    <Image src="/assets/images/address2.png" alt="img" width={34} height={34}   />
                                </div>
                                <div className="solutek-btn">
                                    <Link href="/contact">
                                        {AdressContent.Number}
                                        <div className="solutek-hover-btn hover-bx"></div>
                                        <div className="solutek-hover-btn hover-bx2"></div>
                                        <div className="solutek-hover-btn hover-bx3"></div>
                                        <div className="solutek-hover-btn hover-bx4"></div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-area">
                <div className="container">
                    <div className="row footer">
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="footer-widget">
                                <div className="footer-logo">
                                <Link href="/">
                                    <Image src={LogoContent.img1} alt="img" width={161} height={42}   />
                                </Link>
                                </div>
                                <p className="footer-widget-text">{LogoContent.Content}</p>
                                <div className="footer-social">
                                    <div className="footer-widget-social">
                                        <a href="#"><i className="bi bi-facebook"></i></a>
                                        <a href="#"><i className="bi bi-twitter"></i></a>
                                        <a href="#"><i className="bi bi-linkedin"></i></a>
                                        <a href="#"><i className="bi bi-instagram"></i></a>                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-6 col-sm-6">
                            <div className="footer-widget left">
                                <div className="widget-title">
                                    <h2>Useful Links</h2>
                                </div>
                                <ul>
                                {UsefulLinks.map((item, i) => (
                                    <li key={i}><Link href={item.link}>{item.title}</Link></li>
                                ))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="footer-widget left">
                                <div className="widget-title">
                                    <h2>Solutions.</h2>
                                </div>
                                <ul>
                                {Services.map((item, i) => ( 
                                    <li key={i}><Link href="/service/service-details">{item}</Link></li>
                                ))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="footer-widget-newsletter">
                                <div className="widget-title">
                                    <h2>Newsletter</h2>
                                </div>
                                <p className="newsletter-text">{NewsletterContent.Content}</p>
                                <NewsletterForm />
                            </div>
                        </div>
                    </div>
                    <div className="row copyright">
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="-copyright-text">
                                <p>© Copyright 2025 By Drew Marketing Solutions</p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="copyright-list">
                                <ul>
                                    <li><Link href="/">Privacy Policy</Link></li>
                                    <li><Link href="/">Supports</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
	        </div>
        </div>
    );
};

export default Footer;
"use client"
import { useEffect, useState } from 'react';
import Nav from './Nav';
import Link from 'next/link';
import Image from 'next/image';
export default function HeaderStyle3({ variant, contactAddress, contactEmail, contactHours, socialFacebook, socialTwitter, socialLinkedin, socialInstagram }) {
  const [mobileToggle, setMobileToggle] = useState(false);
  const [isSticky, setIsSticky] = useState();
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  const address = contactAddress || 'Westlands, Nairobi - Kenya';
  const email   = contactEmail   || 'hello@drewmarketingsolutions.com';
  const hours   = contactHours   || '8.00 am - 6.00 pm';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      if (currentScrollPos > prevScrollPos) {
        setIsSticky('cs-gescout_sticky'); // Scrolling down
      } else if (currentScrollPos !== 0) {
        setIsSticky('cs-gescout_show cs-gescout_sticky'); // Scrolling up
      } else {
        setIsSticky();
      }
      setPrevScrollPos(currentScrollPos); // Update previous scroll position
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll); // Cleanup the event listener
    };
  }, [prevScrollPos]);

  return (
    <div className='header-area2 header_nav_03'>
    <header
      className={`cs_site_header cs_style_1 ${
        variant ? variant : ''
      } cs_sticky_header cs_site_header_full_width ${
        mobileToggle ? 'cs_mobile_toggle_active' : ''
      } ${isSticky ? isSticky : ''}`}
    >
      <div className="cs_top_header">
        <div className="container-fluid">
          <div className="cs_top_header_in">
            <div className="cs_top_header_left header-info">
              <ul className="cs_top_nav d-flex flex-wrap align-items-center cs_fs_12 text-white m-0 p-0">
                <li><i className="bi bi-geo-alt-fill"></i>{address}</li>
                <li className="exam-gmail"><i className="bi bi-envelope"></i>{email}</li>
                <li><i className="bi bi-alarm"></i>{hours}</li>
              </ul>
            </div>
            <div className="cs_top_header_right">
            <div className="cs_header_social_links_wrap">
                <div className="cs_header_social_links top-header-social-icon">
                  <ul>
                    {socialFacebook  && <li><a href={socialFacebook}  target="_blank" rel="noopener noreferrer"><i className="bi bi-facebook"></i></a></li>}
                    {socialTwitter   && <li><a href={socialTwitter}   target="_blank" rel="noopener noreferrer"><i className="bi bi-twitter-x"></i></a></li>}
                    {socialLinkedin  && <li><a href={socialLinkedin}  target="_blank" rel="noopener noreferrer"><i className="bi bi-linkedin"></i></a></li>}
                    {socialInstagram && <li><a href={socialInstagram} target="_blank" rel="noopener noreferrer"><i className="bi bi-instagram"></i></a></li>}
                </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cs_main_header cs_accent_bg">
        <div className="container-fluid">
          <div className="cs_main_header_in">

            <div className="cs_main_header_left">
              <Link className="cs_site_branding" href="/">
                <Image src="/assets/images/logo.png" alt="Logo" width={161} height={42}   />
              </Link>
              </div>

              <div className="cs_main_header_center">
                <div className="cs_nav cs_primary_font fw-medium">
                  <span
                    className={
                      mobileToggle
                        ? 'cs-munu_toggle cs_teggle_active'
                        : 'cs-munu_toggle'
                    }
                    onClick={() => setMobileToggle(!mobileToggle)}
                  >
                    <span></span>
                  </span>
                  <Nav setMobileToggle={setMobileToggle} />
                </div>
            </div>
            <div className="cs_main_header_right">
            <div className="solutek-btn2">
						<Link href="/contact">Book a Strategy Session</Link>
					  </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div className="cs_site_header_spacing_140"></div>
    </div>

  );
}

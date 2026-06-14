"use client"
import parse from 'html-react-parser';
import { useState } from 'react';
import VideoModal from '../VideoModal/VideoModal';
import Link from 'next/link';
import Image from 'next/image';

const About4 = ({MainImg,SubTitle,Title,Content,listTitle1,listTitle2,BoxTitle1,BoxTitle2}) => {


	  const [iframeSrc, setIframeSrc] = useState('about:blank');
	  const [toggle, setToggle] = useState(false);
	
	  const handelClick = () => {
		setIframeSrc("https://www.youtube.com/embed/rRid6GCJtgc");
		setToggle(!toggle);
	  };
	  const handelClose = () => {
		setIframeSrc('about:blank');
		setToggle(!toggle);
	  };

    return (
			<div className="about-us-area">
				<div className="container">
					<div className="row">
						<div className="col-lg-6">
							<div className="section-title text-left">
								<h5 className="section-sub-title">{SubTitle}</h5>
								<h1 className="section-main-title">{parse(Title)}</h1>
								<p className="section-title-descr">{Content}
								</p>
							</div>
							<div className="about-us-content">
								<div className="about-us-list">
									<ul>
										<li><span>{listTitle1}</span></li>
										<li><span>{listTitle2}</span></li>
									</ul>
								</div>
								<div className="solutek-btn">
									<Link href="/contact">EXPLORE MORE
										<div className="solutek-hover-btn hover-bx"></div>
										<div className="solutek-hover-btn hover-bx2"></div>
										<div className="solutek-hover-btn hover-bx3"></div>
										<div className="solutek-hover-btn hover-bx4"></div>
									</Link>
								</div>
								<div className="col-lg-3 col-md-6 col-sm-6">
									<div className="single-counter-box">
										<div className="counter-icon">
											<Image src="/assets/images/inner/counter-icon.png"  alt="img" width={70} height={72}   />
										</div>
										<div className="counter-content">
											<h4 className="counter">{BoxTitle1}</h4>
											<span>+</span>
											<p>{BoxTitle2}</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-lg-6">
							<div className="about-us-thumb">
								<div className="about-us-img">
									<Image src={MainImg} alt="img" width={635} height={520}   />
								</div>
								<div className="about-us-video-icon" onClick={handelClick}>	
									<span className="video-vemo-icon venobox vbox-item" data-vbtype="youtube" data-autoplay="true"><i className="bi bi-play"></i><span>WATCH VIDEO</span></span>
								</div>
								<div className="about-us-shape">
								<Image src="/assets/images/inner/us-shape.png" alt="img" width={103} height={22}   />
								</div>
							</div>
						</div>
					</div>
					<div className="about2-us-shape">
						<Image src="/assets/images/inner/about-us-sh.png" alt="img" width={205} height={426}   />
					</div>
					<div className="about-us-shape2">
						<Image src="/assets/images/inner/about-us-she.png" alt="img" width={975} height={790}   />
					</div>
				</div>
				<VideoModal
					isTrue={toggle}
					iframeSrc={iframeSrc}
					handelClose={handelClose}        
					></VideoModal>
			</div>
    );
};

export default About4;
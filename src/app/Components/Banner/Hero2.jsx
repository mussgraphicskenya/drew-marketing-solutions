"use client"
import { useEffect, useState } from "react";
import parse from 'html-react-parser';
import loadBackgroudImages from "../Common/loadBackgroudImages";
import VideoModal from "../VideoModal/VideoModal";
import Link from "next/link";
import Image from "next/image";

const Hero2 = ({bgImg,SubTitle,Title,Content,BtnText,BtnLink,mainImage}) => {

    useEffect(() => {
        loadBackgroudImages();
      }, []);

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
        <div className="hero-area style-two d-flex align-items-center" data-background={bgImg}>
		<div className="container">
			<div className="row hero align-items-center">
				<div className="col-lg-6">
					<div className="hero-contant">
						<h5>{SubTitle}</h5>
						<h1>{parse(Title)}</h1>
						<p>{Content}</p>
						<div className="solutek-btn">
							<Link href={BtnLink} className="btn-2">{BtnText}</Link>
						</div>
						<div className="hero-btn-shape bounce-animate-3">
							<Image src="/assets/images/home-two/hero-btn-shape.png" alt="img" width={47} height={47}   />
						</div>
					</div>
				</div>
				<div className="col-lg-6">
					<div className="hero-thumb hero_thumb_area2">
						<Image src={mainImage} alt="img" width={735} height={535}   />

						<div className="hero-thumb-shape bounce-animate-3">
							<Image src="/assets/images/home-two/hero2-shape.png" alt="img" width={46} height={303}   />
						</div>
						<div className="hero-thumb-shape2 rotateme">
						    <Image src="/assets/images/home-two/border-shape.png" alt="img" width={405} height={405}   />
						</div>
						<div className="hero-video-icon" onClick={handelClick}>	
							<span className="video-vemo-icon hero-icon-video2 venobox vbox-item" data-vbtype="youtube" data-autoplay="true"><i className="bi bi-play"></i></span>
						</div>
					</div>
				</div>
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

export default Hero2;
"use client"
import { useEffect } from "react";
import parse from 'html-react-parser';
import loadBackgroudImages from "../Common/loadBackgroudImages";
import Link from "next/link";
import Image from "next/image";

const About2 = ({bgImg,MainImg,SubTitle,Title,Content,listTitle1,listTitle2,ContactText,Number}) => {

    useEffect(() => {
        loadBackgroudImages();
      }, []);

    return (
        <div className="about-area style-two" data-background={bgImg}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <div className="about-thumbail">
                            <div className="about-thumb">
                                <Image src={MainImg} alt="img" width={542} height={575}   />
                            </div>
                            <div className="about-shape">
                                <Image src="/assets/images/home-two/about-shape.png" alt="img" width={166} height={560}   />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="about-section-content">
                            <div className="section-title text-left">
                                <h5 className="section-sub-title">{SubTitle}</h5>
                                <h1 className="section-main-title">{parse(Title)}</h1>
                                <p className="section-title-descr">{Content}</p>
                            </div>
                            <div className="about-list-item">
                                <ul>
                                    <li>
                                        <Image src="/assets/images/home-two/about-icon2.png" alt="img" width={25} height={24}   />
                                        {listTitle1}</li>
                                    <li><Image src="/assets/images/home-two/about-icon2.png" alt="img" width={25} height={24}   />{listTitle2}</li>
                                </ul>
                            </div>
                            <div className="solutek-btn">
                                 <Link href="/about" className="btn-2">EXPLORE MORE</Link>
                            </div>
                            <div className="about-contact-box">
                                <div className="call-box">
                                    <div className="about-contact">
                                        <Image src="/assets/images/home-two/call-icon.png" alt="img" width={25} height={25}   />
                                    </div>
                                    <div className="about-contact-content">
                                        <h4>{ContactText}</h4>
                                        <p>{Number}</p>
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

export default About2;
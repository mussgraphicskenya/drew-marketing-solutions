"use client"
import parse from 'html-react-parser';
import { useEffect } from "react";
import loadBackgroudImages from "../Common/loadBackgroudImages";
import Link from 'next/link';
import Image from 'next/image';

const About3 = ({bgImg,MainImg,SubTitle,Title,Content,listTitle1,listTitle2,BoxTitle1,BoxTitle2}) => {

    useEffect(() => {
        loadBackgroudImages();
      }, []);
          
    return (
            <div className="about-section" data-background={bgImg}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-lg-6">
                            <div className="about-thumb">
                                <Image src={MainImg} alt="img" width={633} height={623}   />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="about-contact">
                                <div className="section-title text-left">
                                    <h6 className="section-sub-title">{SubTitle}</h6>
                                    <h1 className="section-main-title">{parse(Title)}</h1>
                                    <p className="section-title-descr">{Content}</p>
                                </div>
                                <div className="about-box-item">
                                    <div className="about-box d-flex align-items-center">
                                        <div className="about-icon">
                                            <Image src="/assets/images/about4.png" alt="img" width={45} height={41}   />
                                        </div>
                                        <div className="about-tiltle">
                                            <h3>{BoxTitle1}</h3>
                                        </div>
                                    </div>
                                    <div className="about-box d-flex align-items-center">
                                        <div className="about-icon">
                                            <Image src="/assets/images/about4.png" alt="img" width={45} height={41}   />
                                        </div>
                                        <div className="about-tiltle">
                                            <h3>{BoxTitle2}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="about-item-list">
                                    <ul>
                                        <li>{listTitle1}</li>
                                        <li>{listTitle2}</li>
                                    </ul>
                                </div>
                                <div className="solutek-btn">
                                    <Link href="/about">EXPLORE MORE
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
    );
};

export default About3;
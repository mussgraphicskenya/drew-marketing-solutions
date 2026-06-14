"use client"
import Slider from "react-slick";
import SectionTitle from "../Common/SectionTitle";
import data from '../../Data/testimonial1.json';
import { useEffect } from "react";
import loadBackgroudImages from "../Common/loadBackgroudImages";
import Image from "next/image";

const Testimonial1 = () => {

    useEffect(() => {
        loadBackgroudImages();
      }, []);

      const settings = {
        dots: false,
        infinite: true,
        speed: 600,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        swipeToSlide: true,
        responsive: [
          {
            breakpoint: 1399,
            settings: {
              slidesToShow: 3,
            }
          },
          {
            breakpoint: 1199,
            settings: {
              slidesToShow: 2,
            }
          },{
            breakpoint: 575,
            settings: {
              slidesToShow: 1,
            }
          }
        ]
      };      

    return (
        <div className="testimonial-area" data-background="/assets/images/testi-bg.png">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title text-center">
                            <SectionTitle
                                    SubTitle="TESTIMONIALS"
                                    Title="What Our Customer <span>Says</span>"
                            ></SectionTitle>
                        </div>
                    </div>
                    <div className="row">
                        <div className="testi_list owl-carousel cs_slider_gap_301">
                            <Slider {...settings}>
                            {data.map((item, index)=>(
                            <div key={index} className="col-lg-12 col-md-12">
                                <div className="testi-box">
                                    <div className="testi-single-box">
                                        <div className="testi-icon">
                                            <Image src="/assets/images/testi1.png" alt="img" width={48} height={36}   />
                                        </div>
                                        <div className="testi-content">
                                            <p className="testi-text">{item.desc}</p>
                                            <ul className="testi-rating">
                                                <li><i className="bi bi-star-fill"></i></li>
                                                <li><i className="bi bi-star-fill"></i></li>
                                                <li><i className="bi bi-star-fill"></i></li>
                                                <li><i className="bi bi-star-fill"></i></li>
                                                <li><i className="bi bi-star-fill"></i></li>
                                            </ul>
                                            <h3 className="testi-title">{item.title} <span>{item.subTitle}</span></h3>
                                        </div>
                                    </div>
                                    <div className="testi-author">
                                       <Image src={item.image} alt="img" width={70} height={70}   />
                                    </div>
                                </div>
                            </div>
                            ))}
                            </Slider>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Testimonial1;
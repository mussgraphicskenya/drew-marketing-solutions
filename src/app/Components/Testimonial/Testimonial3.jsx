"use client"
import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import loadBackgroudImages from '../Common/loadBackgroudImages';
import Image from 'next/image';

const Testimonial3 = () => {

    useEffect(() => {
        loadBackgroudImages();
    }, []);

    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/api/testimonials')
            .then(res => res.json())
            .then(items => setData(items))
            .catch(err => console.error('Failed to fetch testimonials:', err));
    }, []);

    const TestimonialContent = {
        bgImg: '/assets/img/faq_img_1.jpg',
        SubTitle: 'client review',
        Title: 'Real results for brands<br> ready to <span>grow.</span>',
        Content: 'We let our work speak for itself. Every engagement starts with strategy and ends with measurable outcomes our clients can see.',
        AuthorImage: '/assets/images/home-3/test-thumb.png',
        AuthorName: 'Sarah Mwangi',
        AuthorDesignation: 'CEO, Retail Brand'
    }

    return (
        <div className="testimonial-area style-four" data-background="/assets/images/home-3/test-bg.png">
            <div className="container">
                <div className="row">
                    <div className="col-lg-5">
                        <div className="section-title text-left">
                            <h6 className="section-sub-title">{TestimonialContent.SubTitle}</h6>
                            <h1 className="section-main-title test_title_area3">{parse(TestimonialContent.Title)}</h1>
                            <p>{TestimonialContent.Content}</p>
                        </div>
                        <div className="testi-thumb">
                            <Image src={TestimonialContent.AuthorImage} alt="img" width={330} height={370} />
                            <div className="testi-autor">
                                <h4 className="testi-user-name">{TestimonialContent.AuthorName}
                                    <span>{TestimonialContent.AuthorDesignation}</span>
                                </h4>
                            </div>
                            <div className="slide-shape">
                                <div className="slide-shape-inner">
                                    <Image src="/assets/images/home-3/slide-shape.png" alt="img" width={71} height={370} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7">
                        <div className="row">
                            <section className="splide">
                                <div className="splide__track">
                                    <div className="splide__list">
                                        {data.map((item, i) => (
                                            <div key={i} className="splide__slide">
                                                <div className="col-lg-12">
                                                    <div className="testi-box">
                                                        <div className="testimonial-single-box">
                                                            <div className="testi-user-rating">
                                                                <ul className="testi-rating">
                                                                    <li><i className="bi bi-star-fill"></i></li>
                                                                    <li><i className="bi bi-star-fill"></i></li>
                                                                    <li><i className="bi bi-star-fill"></i></li>
                                                                    <li><i className="bi bi-star-fill"></i></li>
                                                                    <li><i className="bi bi-star-fill"></i></li>
                                                                </ul>
                                                            </div>
                                                            <div className="testi-text">
                                                                <p className="testi-desc">{item.quote}</p>
                                                            </div>
                                                            <div className="testi-review-user">
                                                                <div className="testi-quote-icon">
                                                                    <Image src="/assets/images/home-3/testi-quote.png" alt="img" width={38} height={28} />
                                                                </div>
                                                                <h3>{item.name} — <span>{item.role}, {item.company}</span></h3>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Testimonial3;
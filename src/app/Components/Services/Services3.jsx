"use client"
import data from '../../Data/services3.json';
import SectionTitle from '../Common/SectionTitle';
import { useEffect } from 'react';
import loadBackgroudImages from '../Common/loadBackgroudImages';
import Link from 'next/link';
import Image from 'next/image';

const Services3 = () => {

    useEffect(() => {
        loadBackgroudImages();
      }, []);

    return (
        <div className="our-service-section" data-background="/assets/images/home-3/service-bg.png">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title text-center">
                            <SectionTitle
                                    SubTitle="OUR SERVICES"
                                    Title="EXCLUSIVE IT SERVICES"
                            ></SectionTitle>
                        </div>
                    </div>
                </div>
                <div className="row">
                {data.map((item, i) => (
                    <div key={i} className="col-lg-4 col-md-6">
                        <div className="service-box">
                            <div className="single-service-box">
                                <div className="service-icon">
                                    <Image src={item.icon} alt="img" width={40} height={40}   />
                                </div>
                                <div className="service-box-content">
                                    <h4 className="service-title">
                                        <Link href="/service/service-details">{item.title}</Link>
                                        </h4>
                                    <p className="service-desc">{item.desc}</p>
                                </div>
                            </div>
                            <div className="service-thumb">
                                <Image src={item.image} alt="img" width={361} height={200}   />
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};

export default Services3;
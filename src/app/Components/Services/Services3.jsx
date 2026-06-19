import { unstable_noStore as noStore } from 'next/cache';
import SectionTitle from '../Common/SectionTitle';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

const thumbs = [
    '/assets/images/home-3/ser-thumb.png',
    '/assets/images/home-3/ser-thumb2.png',
    '/assets/images/home-3/ser-thumb3.png',
];

const icons = [
    '/assets/images/home-3/ser-icon.png',
    '/assets/images/home-3/ser-icon2.png',
    '/assets/images/home-3/ser-icon3.png',
];

const Services3 = async () => {
    noStore();
    await connectDB();
    const data = await mongoose.connection
        .collection('solutions')
        .find({})
        .sort({ order: 1 })
        .toArray();

    return (
        <div className="our-service-section" data-background="/assets/images/home-3/service-bg.png">
            {/* Fix: equal-height cards + icon centering + title spacing */}
            <style>{`
                .our-service-section .row-services {
                    display: flex;
                    flex-wrap: wrap;
                }
                .our-service-section .col-service {
                    display: flex;
                    flex-direction: column;
                }
                .our-service-section .service-box {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                .our-service-section .single-service-box {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }
                /* Centre icon image inside the orange circle */
                .our-service-section .service-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 1;
                }
                /* Prevent long titles from pushing the underline rule down */
                .our-service-section h4.service-title {
                    font-size: 20px !important;
                    line-height: 1.35 !important;
                    min-height: 54px;
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 14px !important;
                }
                /* Let the description grow to fill available space */
                .our-service-section p.service-desc {
                    flex: 1;
                }
            `}</style>

            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title text-center">
                            <SectionTitle
                                SubTitle="OUR SERVICES"
                                Title="WHAT WE DO FOR YOUR BRAND"
                            ></SectionTitle>
                        </div>
                    </div>
                </div>

                {/* row-services applies the flex equal-height fix */}
                <div className="row row-services">
                    {data.map((item, i) => (
                        <div key={String(item._id)} className="col-lg-4 col-md-6 col-service mb-4">
                            <div className="service-box">
                                <div className="single-service-box">
                                    {/* Orange circle icon */}
                                    <div className="service-icon">
                                        <img
                                            src={item.icon || icons[i % 3]}
                                            alt="service icon"
                                            width={36}
                                            height={36}
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                objectFit: 'contain',
                                                filter: 'brightness(0) invert(1)',
                                            }}
                                        />
                                    </div>

                                    <div className="service-box-content">
                                        <h4 className="service-title">
                                            <Link href={`/service/${item.slug || '#'}`}>{item.title}</Link>
                                        </h4>
                                        <p className="service-desc">{item.headline}</p>
                                    </div>
                                </div>

                                {/* Thumbnail image */}
                                <div className="service-thumb">
                                    {/* plain img avoids next/image layout issues for absolutely-positioned elements */}
                                    <img
                                        src={item.image || thumbs[i % 3]}
                                        alt={item.title || 'service'}
                                        width={361}
                                        height={200}
                                        style={{ width: '100%', height: 'auto' }}
                                    />
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
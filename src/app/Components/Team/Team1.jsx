import { unstable_noStore as noStore } from 'next/cache';
import Image from 'next/image';
import SectionTitle from '../Common/SectionTitle';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

const Team1 = async () => {
    noStore();
    await connectDB();
    const docs = await mongoose.connection
        .collection('teams')
        .find({})
        .sort({ order: 1 })
        .toArray();

    return (
        <div className="team-area style-two">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title text-center">
                            <SectionTitle
                                SubTitle="OUR TEAM"
                                Title="The People Behind <span>Drew.</span>"
                            ></SectionTitle>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {docs.map((item, i) => (
                        <div key={i} className="col-xl-3 col-lg-4 col-md-6">
                            <div className="single-team-box">
                                <div className="single-team-thumb">
                                    <Image
                                        src={item.image || '/assets/images/home-two/team-thu.png'}
                                        alt={item.name || 'Team member'}
                                        width={306}
                                        height={388}
                                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                    />
                                    <div className="team-content">
                                        <div className="team-inner-title">
                                            <h4><a href="#">{item.name}</a></h4>
                                            <p>{item.role}</p>
                                        </div>
                                        <div className="team-social-icon">
                                            <ul>
                                                {item.facebook && (
                                                    <li><a href={item.facebook} target="_blank" rel="noopener noreferrer"><i className="bi bi-facebook"></i></a></li>
                                                )}
                                                {item.twitter && (
                                                    <li><a href={item.twitter} target="_blank" rel="noopener noreferrer"><i className="bi bi-twitter-x"></i></a></li>
                                                )}
                                                {item.linkedin && (
                                                    <li><a href={item.linkedin} target="_blank" rel="noopener noreferrer"><i className="bi bi-linkedin"></i></a></li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Team1;
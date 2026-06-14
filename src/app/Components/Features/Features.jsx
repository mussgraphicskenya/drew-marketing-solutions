import Image from 'next/image';
import data from '../../Data/feature.json'

const Features = () => {
    return (
        <div className="feature-area">
                <div className="container">
                    <div className="row about align-items-center">
                        <div className="feature-box">
                        {data.map((item, i) => (
                            <div key={i} className="feature-sinble-single-box">
                                <div className="feature-icon">
                                    <Image src={item.img} alt="img" width={36} height={36}   />
                                </div>
                                <div className="feature-content">
                                    <h3 className="feature-title">{item.title}</h3>
                                    <p className="feature-text">{item.desc}</p>
                                </div>
                            </div>
                             ))}

                        </div>
                    </div>
                </div>	
            </div>
    );
};

export default Features;
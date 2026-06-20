'use client';
import { useState } from 'react';

const FAQ_ITEMS = [
    {
        title: 'How long does a typical engagement take?',
        desc: 'Most strategy engagements run 6–12 weeks depending on scope. Campaign execution is typically ongoing. We always define clear milestones upfront so you know exactly what to expect at each stage.',
    },
    {
        title: 'Do you work with businesses outside Nairobi?',
        desc: 'Yes. While our roots are in Nairobi, we work with clients across Kenya and East Africa. For pan-African or global campaigns, we leverage our network of vetted regional partners.',
    },
    {
        title: 'Can I see case studies from our industry before engaging?',
        desc: 'Absolutely — visit our Case Studies page or contact us directly and we\'ll share the most relevant work from your sector under NDA if required.',
    },
    {
        title: 'What\'s the minimum budget you work with?',
        desc: 'We tailor scopes to fit different investment levels. Book a strategy session and we\'ll recommend the right starting point for your goals and resources.',
    },
];

export default function ServiceFaqAccordion() {
    const [open, setOpen] = useState(0);

    return (
        <div className="col-lg-12 col-md-12" style={{ marginTop: '30px' }}>
            <div className="tab_container">
                <div className="feq-content">
                    <h3 className="faq-title">Frequently Asked Questions</h3>
                    <p className="faq-description">
                        Common questions about this service — and how we typically approach them.
                    </p>
                </div>
                <div className="tab_content">
                    <ul className="accordion">
                        {FAQ_ITEMS.map((item, index) => (
                            <li
                                key={index}
                                className={`cs_accordian ${index === open ? 'active' : ''}`}
                            >
                                <a
                                    onClick={() => setOpen(index === open ? -1 : index)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span>{item.title}</span>
                                </a>
                                <p>{item.desc}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

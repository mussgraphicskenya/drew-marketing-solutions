"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Client component — receives pre-fetched, serialised case study data
 * and distinct industry values from the Projecr3 server wrapper.
 * Handles interactive category filter entirely client-side.
 */
const Projecr3Client = ({ data = [], industries = [] }) => {
    const [active, setActive] = useState('all');

    const filtered = active === 'all' ? data : data.filter(item => item.category === active);

    return (
        <div className="case-study-area project-main-area">
            <div className="container">
                {/* ── Category filter bar ── */}
                <div className="row case-study-bg">
                    <div className="col-lg-12 col-sm-12">
                        <div className="case_study_nav">
                            <div className="case_study_menu">
                                <ul className="menu-filtering">
                                    <li
                                        className={active === 'all' ? 'active' : ''}
                                        onClick={() => setActive('all')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        SEE ALL
                                    </li>
                                    {industries.map((industry) => (
                                        <li
                                            key={industry}
                                            className={active === industry ? 'active' : ''}
                                            onClick={() => setActive(industry)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {industry}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Case study grid ── */}
                <div className="row image_load">
                    {filtered.length === 0 && (
                        <div className="col-12 text-center" style={{ padding: '60px 0', color: '#9aa0b4' }}>
                            No case studies found in this category.
                        </div>
                    )}
                    {filtered.map((item) => (
                        <div key={item._id} className="col-lg-6 col-sm-6 project-grid-area grid-item">
                            <div className="case-study-single-box">
                                <div className="case-study-thumb">
                                    {/* Aspect-ratio container — forces 606:447 regardless of source image ratio */}
                                    <div style={{ position: 'relative', width: '100%', paddingTop: '73.7%', overflow: 'hidden' }}>
                                        <Image
                                            src={item.img}
                                            alt={item.title || 'Case Study'}
                                            fill
                                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    </div>
                                </div>
                                <div className="case-study-content1">
                                    <div className="case-study-title">
                                        <h5>{item.category}</h5>
                                        <h3>
                                            <Link href={item.slug ? `/project/${item.slug}` : '/project'}>
                                                {item.title}
                                            </Link>
                                        </h3>
                                    </div>
                                    <div className="case-study-icon">
                                        <Link href={item.slug ? `/project/${item.slug}` : '/project'}>
                                            <i className="bi bi-arrow-right"></i>
                                        </Link>
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

export default Projecr3Client;

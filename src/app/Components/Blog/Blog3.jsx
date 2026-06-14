import Link from 'next/link';
import Image from 'next/image';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

const Blog3 = async ({ category }) => {
    await connectDB();

    // Build filter — if a category is passed, filter by it; otherwise fetch all
    const filter = category ? { category } : {};

    const data = await mongoose.connection
        .collection('insights')
        .find(filter)
        .sort({ createdAt: -1 })
        .toArray();

    return (
        <div className="blog-area style-grid">
            <div className="container">
                {/* Active filter banner */}
                {category && (
                    <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: '#9aa0b4', fontSize: '14px' }}>
                            Filtering by:
                        </span>
                        <span style={{ background: 'rgba(79,110,247,0.12)', color: '#7b96fb', fontSize: '13px', padding: '4px 14px', borderRadius: '20px', fontWeight: 600 }}>
                            {category}
                        </span>
                        <Link href="/blog" style={{ color: '#9aa0b4', fontSize: '13px', textDecoration: 'none' }}>
                            <i className="bi bi-x-circle me-1"></i>Clear filter
                        </Link>
                    </div>
                )}

                <div className="row">
                    {data.length === 0 ? (
                        <div className="col-lg-12" style={{ textAlign: 'center', padding: '60px 0', color: '#9aa0b4' }}>
                            <i className="bi bi-inbox" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}></i>
                            No insights found{category ? ` in "${category}"` : ''}.{' '}
                            {category && <Link href="/blog" style={{ color: '#4f6ef7' }}>View all insights</Link>}
                        </div>
                    ) : (
                        data.map((item, i) => (
                            <div key={i} className="col-lg-4 col-md-6">
                                <div className="single-blog-box">
                                    <div className="single-blog-thumb">
                                        <Image src={item.coverImage || '/assets/images/blog1.png'} alt={item.title || 'Insight'} width={364} height={248} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                                    </div>
                                    <div className="blog-box-content">
                                        <div className="meta-blog">
                                            <Link href={`/blog/${item.slug}`}><span><i className="bi bi-person-plus"></i>By {item.author}</span></Link>
                                            <p><span>
                                                <Image src="/assets/images/inner/grid-calen.png" alt="img" width={14} height={14} />
                                            </span>{new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                        <h3><Link href={`/blog/${item.slug}`}>{item.title}</Link></h3>
                                        <div className="blog-button">
                                            <Link href={`/blog/${item.slug}`}>READ MORE<i className="bi bi-arrow-right"></i></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Blog3;
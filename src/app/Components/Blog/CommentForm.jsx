'use client';

import { useState } from 'react';

export default function CommentForm({ insightSlug }) {
    const [form, setForm] = useState({ name: '', email: '', comment: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, insightSlug }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to submit.');
            setSuccess(data.message || 'Your comment has been submitted for review.');
            setForm({ name: '', email: '', comment: '' });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="blog-details-contact">
            <div className="blog-details-contact-title">
                <h4>Leave A Comment</h4>
            </div>

            {success && (
                <div className="alert alert-success" role="alert" style={{ borderRadius: '8px', marginBottom: '20px' }}>
                    <i className="bi bi-check-circle-fill me-2"></i>{success}
                </div>
            )}
            {error && (
                <div className="alert alert-danger" role="alert" style={{ borderRadius: '8px', marginBottom: '20px' }}>
                    <i className="bi bi-exclamation-circle me-2"></i>{error}
                </div>
            )}

            {!success && (
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="contact-input-box">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name *"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="contact-input-box">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address *"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="contact-input-box">
                                <textarea
                                    name="comment"
                                    placeholder="Write your comment..."
                                    rows={5}
                                    value={form.comment}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="blog-details-submi-button">
                                <button type="submit" disabled={loading}>
                                    {loading ? (
                                        <><i className="bi bi-hourglass-split me-2"></i>Submitting…</>
                                    ) : (
                                        <>Post Comment</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}

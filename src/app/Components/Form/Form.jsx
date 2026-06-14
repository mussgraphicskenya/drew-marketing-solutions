'use client';

import { useState } from 'react';

const EMPTY = { name: '', email: '', subject: '', phone: '', message: '' };

const Form = () => {
    const [fields,  setFields]  = useState(EMPTY);
    const [status,  setStatus]  = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

    function handleChange(e) {
        const { name, value } = e.target;
        setFields((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch('/api/contact', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(fields),
            });
            if (!res.ok) throw new Error('failed');
            setStatus('success');
            setFields(EMPTY);
        } catch {
            setStatus('error');
        }
    }

    return (
        <div className="contact_from_box">
            <form id="dreamit-form" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="form_box">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name *"
                                required
                                value={fields.name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="form_box">
                            <input
                                type="email"
                                name="email"
                                placeholder="Your E-Mail *"
                                required
                                value={fields.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="form_box">
                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject *"
                                required
                                value={fields.subject}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="form_box">
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone *"
                                required
                                value={fields.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="form_box">
                            <textarea
                                name="message"
                                id="message"
                                cols="30"
                                rows="10"
                                placeholder="Message"
                                value={fields.message}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <div className="quote_button">
                            <button className="btn" type="submit" disabled={status === 'loading'}>
                                {status === 'loading' ? 'SENDING...' : 'SEND NOW'}{' '}
                                <i className="bi bi-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {status === 'success' && (
                <div id="status" style={{ marginTop: '16px', color: '#00c48c', fontWeight: 600, fontSize: '15px' }}>
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Thank you! We will be in touch soon.
                </div>
            )}
            {status === 'error' && (
                <div id="status" className="error" style={{ marginTop: '16px', color: '#ff3c00', fontWeight: 600, fontSize: '15px' }}>
                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                    Something went wrong. Please try again.
                </div>
            )}
            {status === 'idle' && <div id="status" className="error"></div>}
        </div>
    );
};

export default Form;
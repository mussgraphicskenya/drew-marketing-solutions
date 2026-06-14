'use client';

import { useState } from 'react';

const NewsletterForm = () => {
    const [email,  setEmail]  = useState('');
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error' | 'duplicate'

    async function handleSubmit(e) {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch('/api/newsletter', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ email }),
            });

            if (res.status === 409) {
                setStatus('duplicate');
                return;
            }
            if (!res.ok) throw new Error('failed');

            setStatus('success');
            setEmail('');
        } catch {
            setStatus('error');
        }
    }

    return (
        <div>
            <div className="Subscribe-form2">
                <form onSubmit={handleSubmit}>
                    <div className="form-field2">
                        <input
                            type="email"
                            name="EMAIL"
                            placeholder="Enter Your E-mail"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={status === 'loading' || status === 'success'}
                        />
                        <button
                            className="subscribe-button"
                            type="submit"
                            disabled={status === 'loading' || status === 'success'}
                        >
                            <i className={status === 'loading' ? 'bi bi-hourglass-split' : 'bi bi-send'}></i>
                        </button>
                    </div>
                </form>
            </div>

            {status === 'success' && (
                <p style={{ color: '#00c48c', fontSize: '13px', marginTop: '10px', fontWeight: 600 }}>
                    <i className="bi bi-check-circle-fill me-1"></i>Subscribed successfully!
                </p>
            )}
            {(status === 'error' || status === 'duplicate') && (
                <p style={{ color: '#ff7c5c', fontSize: '13px', marginTop: '10px', fontWeight: 600 }}>
                    <i className="bi bi-exclamation-circle-fill me-1"></i>
                    {status === 'duplicate'
                        ? 'Already subscribed or something went wrong.'
                        : 'Already subscribed or something went wrong.'}
                </p>
            )}
        </div>
    );
};

export default NewsletterForm;

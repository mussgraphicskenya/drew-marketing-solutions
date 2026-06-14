'use client';

import { useState } from 'react';

/**
 * MarkReadButton
 * @param {string}  id      - MongoDB message _id
 * @param {boolean} isRead  - current read state
 */
export default function MarkReadButton({ id, isRead }) {
    const [loading, setLoading]   = useState(false);
    const [read,    setRead]      = useState(isRead);

    async function toggle() {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/messages/${id}`, {
                method:  'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ read: !read }),
            });
            if (!res.ok) throw new Error('Failed');
            setRead((prev) => !prev);
            // Reload the page so the list / badge re-renders from the server
            window.location.reload();
        } catch {
            alert('Could not update message status.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            type="button"
            onClick={toggle}
            disabled={loading}
            style={{
                background:   read ? 'rgba(167,139,250,0.08)' : 'rgba(167,139,250,0.18)',
                border:       '1px solid rgba(167,139,250,0.3)',
                color:        loading ? '#5a6070' : '#a78bfa',
                padding:      '5px 12px',
                borderRadius: '6px',
                cursor:       loading ? 'not-allowed' : 'pointer',
                fontSize:     '13px',
                fontWeight:   600,
                display:      'inline-flex',
                alignItems:   'center',
                gap:          '5px',
                whiteSpace:   'nowrap',
                transition:   'opacity 0.2s',
                opacity:      loading ? 0.6 : 1,
            }}
        >
            <i className={loading ? 'bi bi-hourglass-split' : read ? 'bi bi-envelope' : 'bi bi-envelope-open'}></i>
            {loading ? 'Updating…' : read ? 'Mark Unread' : 'Mark Read'}
        </button>
    );
}

'use client';

import { useState } from 'react';

export default function DeleteButton({ id, collectionName, itemName }) {
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        const label = itemName ? `"${itemName}"` : 'this item';
        if (!window.confirm(`Are you sure you want to delete ${label}? This cannot be undone.`)) {
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/admin/delete', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ id, collectionName }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                alert(`Delete failed: ${data.error ?? 'Unknown error'}`);
                return;
            }

            window.location.reload();
        } catch (err) {
            alert('Network error — please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            style={{
                background:   'rgba(255,60,0,0.12)',
                border:       '1px solid rgba(255,60,0,0.25)',
                color:        loading ? '#7a3020' : '#ff7c5c',
                padding:      '5px 12px',
                borderRadius: '6px',
                cursor:       loading ? 'not-allowed' : 'pointer',
                fontSize:     '13px',
                fontWeight:   600,
                display:      'inline-flex',
                alignItems:   'center',
                gap:          '4px',
                transition:   'opacity 0.2s',
                opacity:      loading ? 0.6 : 1,
            }}
        >
            <i className={loading ? 'bi bi-hourglass-split' : 'bi bi-trash'}></i>
            {loading ? 'Deleting…' : 'Delete'}
        </button>
    );
}

'use client';

import { useState, useEffect, useCallback } from 'react';

export default function AdminCommentsPage() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);
    const [error, setError] = useState('');

    const fetchComments = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/admin/comments', { cache: 'no-store' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to load comments');
            setComments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchComments(); }, [fetchComments]);

    async function handleApprove(id) {
        setActionId(id);
        try {
            const res = await fetch(`/api/admin/comments/${id}`, { method: 'PATCH' });
            if (!res.ok) throw new Error('Failed to approve');
            setComments((prev) => prev.filter((c) => String(c._id) !== id));
        } catch (err) {
            alert(err.message);
        } finally {
            setActionId(null);
        }
    }

    async function handleReject(id) {
        if (!confirm('Permanently delete this comment?')) return;
        setActionId(id);
        try {
            const res = await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            setComments((prev) => prev.filter((c) => String(c._id) !== id));
        } catch (err) {
            alert(err.message);
        } finally {
            setActionId(null);
        }
    }

    return (
        <div style={{ fontFamily: 'var(--body-color-font, system-ui, sans-serif)', maxWidth: '900px' }}>

            {/* Page header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h2 style={{ color: '#111827', fontSize: '20px', fontWeight: 700, margin: 0 }}>Comment Moderation</h2>
                    <p style={{ color: '#6b7280', fontSize: '14px', margin: '4px 0 0' }}>
                        {loading ? 'Loading…' : `${comments.length} pending comment${comments.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <button
                    onClick={fetchComments}
                    style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#374151', fontSize: '13px', padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                >
                    <i className="bi bi-arrow-clockwise"></i> Refresh
                </button>
            </div>

            {error && (
                <div style={{ background: '#fff3cd', border: '1px solid #ffc107', color: '#856404', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '14px' }}>
                    <i className="bi bi-exclamation-circle me-2"></i>{error}
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
                    <i className="bi bi-hourglass-split me-2"></i>Loading comments…
                </div>
            ) : comments.length === 0 ? (
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', textAlign: 'center', padding: '80px 0', color: '#9ca3af' }}>
                    <i className="bi bi-chat-square-text" style={{ fontSize: '48px', display: 'block', marginBottom: '16px', opacity: 0.4 }}></i>
                    <p style={{ fontSize: '16px', margin: 0 }}>No pending comments — all clear!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {comments.map((c) => {
                        const id = String(c._id);
                        const isActing = actionId === id;
                        return (
                            <div
                                key={id}
                                style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '22px', opacity: isActing ? 0.5 : 1, transition: '0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                            >
                                {/* Header row */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'flex-start', marginBottom: '14px' }}>
                                    <div style={{ flex: 1, minWidth: '220px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(167,139,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <i className="bi bi-person-fill" style={{ color: '#7c3aed', fontSize: '16px' }}></i>
                                            </div>
                                            <div>
                                                <div style={{ color: '#111827', fontWeight: 700, fontSize: '15px' }}>{c.name}</div>
                                                <div style={{ color: '#9ca3af', fontSize: '12px' }}>{c.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <span style={{ background: 'rgba(79,110,247,0.1)', color: '#1B3A8C', fontSize: '12px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600 }}>
                                            <i className="bi bi-link-45deg me-1"></i>{c.insightSlug}
                                        </span>
                                        <div style={{ color: '#9ca3af', fontSize: '11px', marginTop: '4px' }}>
                                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                        </div>
                                    </div>
                                </div>

                                {/* Comment text */}
                                <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '14px 16px', marginBottom: '16px', color: '#374151', fontSize: '14px', lineHeight: 1.7, borderLeft: '3px solid rgba(167,139,250,0.5)' }}>
                                    {c.comment}
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={() => handleApprove(id)}
                                        disabled={isActing}
                                        style={{ padding: '8px 20px', background: 'rgba(0,196,140,0.1)', border: '1px solid rgba(0,196,140,0.3)', borderRadius: '8px', color: '#047857', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        <i className="bi bi-check-lg"></i>
                                        {isActing ? 'Approving…' : 'Approve'}
                                    </button>
                                    <button
                                        onClick={() => handleReject(id)}
                                        disabled={isActing}
                                        style={{ padding: '8px 20px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#dc2626', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        <i className="bi bi-trash3"></i>
                                        {isActing ? 'Deleting…' : 'Reject'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

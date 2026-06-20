'use client';

import { useState, useRef } from 'react';

/**
 * PdfUpload — admin component for uploading PDF files to Cloudinary.
 *
 * Props:
 *   value    — current PDF URL string (from DB)
 *   onChange — callback called with the new URL on successful upload
 *   label    — optional label override (defaults to "PDF Document")
 */
export default function PdfUpload({ value, onChange, label = 'PDF Document' }) {
    const [uploading, setUploading] = useState(false);
    const [error,     setError]     = useState('');
    const [filename,  setFilename]  = useState('');
    const inputRef = useRef(null);

    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Client-side pre-validation
        if (file.type !== 'application/pdf') {
            setError('Only PDF files are accepted.');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError(`File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 10 MB.`);
            return;
        }

        setUploading(true);
        setError('');
        setFilename(file.name);

        try {
            const fd = new FormData();
            fd.append('file', file);

            const res  = await fetch('/api/upload-pdf', { method: 'POST', body: fd });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Upload failed');

            onChange(data.url);
            setFilename(data.filename || file.name);
        } catch (err) {
            setError(err.message);
            setFilename('');
        } finally {
            setUploading(false);
            // Reset the file input so the same file can be re-selected if needed
            if (inputRef.current) inputRef.current.value = '';
        }
    }

    function handleRemove() {
        onChange('');
        setFilename('');
        setError('');
    }

    return (
        <div style={{ marginTop: '6px' }}>
            {/* Hidden native file input */}
            <input
                ref={inputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id={`pdf-input-${label.replace(/\s+/g, '-')}`}
            />

            {value ? (
                /* ── Uploaded state ── */
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
                    padding: '10px 14px',
                    background: 'rgba(0,196,140,0.06)',
                    border: '1px solid rgba(0,196,140,0.25)',
                    borderRadius: '8px',
                }}>
                    <i className="bi bi-file-earmark-pdf-fill" style={{ color: '#ff4444', fontSize: '20px' }}></i>
                    <span style={{ color: '#e0e4f0', fontSize: '13px', flex: 1, wordBreak: 'break-all' }}>
                        {filename || 'PDF uploaded'}
                    </span>
                    <i className="bi bi-check-circle-fill" style={{ color: '#00c48c', fontSize: '16px' }}></i>
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#00c48c', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}
                    >
                        View PDF ↗
                    </a>
                    <button
                        type="button"
                        onClick={handleRemove}
                        style={{
                            background: 'none',
                            border: '1px solid rgba(255,60,0,0.4)',
                            color: '#ff7c5c',
                            padding: '3px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            cursor: 'pointer',
                        }}
                    >
                        Remove
                    </button>
                </div>
            ) : (
                /* ── Upload button state ── */
                <label
                    htmlFor={`pdf-input-${label.replace(/\s+/g, '-')}`}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '9px 16px',
                        background: uploading ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.06)',
                        border: '1px dashed rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: uploading ? '#5a6070' : '#9aa0b4',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: uploading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                    }}
                >
                    {uploading ? (
                        <><i className="bi bi-hourglass-split"></i> Uploading…</>
                    ) : (
                        <><i className="bi bi-file-earmark-arrow-up"></i> Choose PDF</>
                    )}
                </label>
            )}

            {error && (
                <p style={{ color: '#ff7c5c', fontSize: '12px', marginTop: '6px' }}>
                    <i className="bi bi-exclamation-circle me-1"></i>{error}
                </p>
            )}
        </div>
    );
}

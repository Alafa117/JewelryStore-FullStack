// src/components/icons.jsx
import React from 'react'

export function IconLike({ className = '', title = 'Like' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" role="img">
            <title>{title}</title>
            <path d="M14 9V5a2 2 0 0 0-2-2h-1.5A2.5 2.5 0 0 0 8 5.5V9H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8.5a3.5 3.5 0 0 0 3.464-2.9L18.9 11.5A2 2 0 0 0 17.1 10H14z" />
        </svg>
    )
}

export function IconDislike({ className = '', title = 'Dislike' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" role="img">
            <title>{title}</title>
            <path d="M10 15v4a2 2 0 0 0 2 2h1.5A2.5 2.5 0 0 0 16 20.5V15h3a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H11.5A3.5 3.5 0 0 0 8.036 6.9L5.1 12.5A2 2 0 0 0 6.9 14H10z" />
        </svg>
    )
}

export function IconHeart({ className = '', title = 'Me gusta' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" role="img">
            <title>{title}</title>
            <path d="M12.001 20s-7.6-4.93-9.2-7.04A5.2 5.2 0 0 1 2 8.9 4.8 4.8 0 0 1 7 5.2c1.8 0 2.8 1.1 2.999 1.4C10.2 6.3 11.2 5.2 13 5.2A4.8 4.8 0 0 1 18 8.9c0 1.3-.8 2.78-1.8 3.98C16.1 15.07 12 20 12 20z" />
        </svg>
    )
}

// src/store/likes.js
import { create } from 'zustand'

const LS_KEY = 'likes_state'

function load() {
    try {
        const raw = localStorage.getItem(LS_KEY)
        return raw ? JSON.parse(raw) : {}
    } catch (e) {
        console.error('[likes] load error', e)
        return {}
    }
}

function save(state) {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(state))
    } catch (e) {
        console.error('[likes] save error', e)
    }
}

const useLikes = create((set, get) => ({
    items: typeof window !== 'undefined' ? load() : {},

    getItem: (id) => {
        const items = get().items || {}
        return items[id] || { liked: false, disliked: false, megusta: false }
    },

    toggleLike: (id) => {
        try {
            const items = { ...(get().items || {}) }
            const cur = items[id] || { liked: false, disliked: false, megusta: false }
            const next = { ...cur, liked: !cur.liked }
            if (next.liked) next.disliked = false
            items[id] = next
            set({ items }, false)
            save(items)
            console.debug('[likes] toggleLike', { id, next })
        } catch (err) {
            console.error('[likes] toggleLike error', err)
        }
    },

    toggleDislike: (id) => {
        try {
            const items = { ...(get().items || {}) }
            const cur = items[id] || { liked: false, disliked: false, megusta: false }
            const next = { ...cur, disliked: !cur.disliked }
            if (next.disliked) next.liked = false
            items[id] = next
            set({ items }, false)
            save(items)
            console.debug('[likes] toggleDislike', { id, next })
        } catch (err) {
            console.error('[likes] toggleDislike error', err)
        }
    },

    toggleMeGusta: (id) => {
        try {
            const items = { ...(get().items || {}) }
            const cur = items[id] || { liked: false, disliked: false, megusta: false }
            const next = { ...cur, megusta: !cur.megusta }
            items[id] = next
            set({ items }, false)
            save(items)
            console.debug('[likes] toggleMeGusta', { id, next })
        } catch (err) {
            console.error('[likes] toggleMeGusta error', err)
        }
    },

    clearAll: () => {
        set({ items: {} }, false)
        save({})
    }
}))

export default useLikes

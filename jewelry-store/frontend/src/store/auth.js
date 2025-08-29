// src/store/auth.js
import { create } from 'zustand'

const useAuth = create((set, get) => ({
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,

    setSession: (token, user) => {
        try {
            console.log('[auth] setSession', { hasToken: !!token, role: user?.role })
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            set({ token, user })
        } catch (err) {
            console.error('[auth] setSession error', err)
        }
    },

    logout: () => {
        try {
            console.log('[auth] logout')
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            set({ token: null, user: null })
        } catch (err) {
            console.error('[auth] logout error', err)
        }
    },

    isAuthenticated: () => !!get().token,
}))

export default useAuth

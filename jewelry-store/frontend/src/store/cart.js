// src/store/cart.js
import { create } from 'zustand'

const useCart = create((set, get) => ({
    items: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart_items') || '[]') : [],
    addItem: (item) => {
        try {
            const items = [...get().items, item]
            localStorage.setItem('cart_items', JSON.stringify(items))
            set({ items })
            console.debug('[cart] addItem', item)
        } catch (err) {
            console.error('[cart] addItem error', err)
        }
    },
    removeItem: (id) => {
        try {
            const items = get().items.filter(x => x.id !== id)
            localStorage.setItem('cart_items', JSON.stringify(items))
            set({ items })
            console.debug('[cart] removeItem', id)
        } catch (err) {
            console.error('[cart] removeItem error', err)
        }
    },
    clear: () => {
        try {
            localStorage.removeItem('cart_items')
            set({ items: [] })
            console.debug('[cart] clear')
        } catch (err) {
            console.error('[cart] clear error', err)
        }
    }
}))

export default useCart

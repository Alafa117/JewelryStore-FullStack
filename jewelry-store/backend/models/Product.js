// backend/models/Product.js
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    meta: { type: String, default: '' }, // texto extra si quieres
    category: { type: String, enum: ['Anillos', 'Collares', 'Pendientes', 'Otros'], default: 'Otros' },
    material: { type: String, enum: ['Bronce', 'Plata', 'Oro', 'Otro'], default: 'Plata' },
    price: { type: Number, required: true, default: 0 },
    stock: { type: Number, default: 0 },
    images: [{ type: String }], // URLs
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)

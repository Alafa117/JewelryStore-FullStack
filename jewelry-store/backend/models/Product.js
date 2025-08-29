// backend/models/Product.js
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 200 },
    category: { type: String, required: true, trim: true }, // e.g. "Anillos"
    material: { type: String, trim: true }, // e.g. "Plata", "Oro"
    price: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true, default: '' },
    images: [{ type: String }], // URLs (opcional)
    stock: { type: Number, default: 1, min: 0 },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)

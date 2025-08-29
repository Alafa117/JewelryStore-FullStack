// models/User.js
const mongoose = require('mongoose')
const { isEmail } = require('validator')

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, validate: [isEmail, 'Invalid email'] },
    password: { type: String, required: true },
    role: { type: String, enum: ['User', 'Seller', 'Admin'], default: 'User' },
    // opcional: emailVerified, avatar, etc.
    emailVerified: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Unique identifier fields
    userId: { 
        type: String, 
        required: true, 
        unique: true,
        default: () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    },    
    // New fields with validation (assuming scale is 0-5)
    development: { type: Number, default: 0, min: 0, max: 5 },
    guidance: { type: Number, default: 0, min: 0, max: 5 },
    purpose: { type: Number, default: 0, min: 0, max: 5 },
    speaking: { type: Number, default: 0, min: 0, max: 5 },
    story: { type: Number, default: 0, min: 0, max: 5 },
    systems: { type: Number, default: 0, min: 0, max: 5 },
    time_energy: { type: Number, default: 0, min: 0, max: 5 },
    values: { type: Number, default: 0, min: 0, max: 5 },
    vision: { type: Number, default: 0, min: 0, max: 5 },
    evaluation: { type: Number, default: 0, min: 0, max: 5 },
    totalScore: { type: Number, default: 0, min: 0, max: 50 },
}, 
// Add timestamps (createdAt, updatedAt)
{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
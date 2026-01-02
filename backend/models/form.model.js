// models/Form.js
const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String, 
    default: 'Untitled Form'
  },
  isPublished: {
    type: Boolean,
    default: false,
  },

  // The Polymorphic Pattern
  // Using 'Mixed' allows objects in this array to have different shapes
  // e.g., { type: 'checkbox', options: [...] } vs { type: 'text', placeholder: '...' }
  fields: [
    {
      type: mongoose.Schema.Types.Mixed,
    },
  ],
  createdAt: { 
    type: Date, 
    default: Date.now,
  }
});

module.exports = mongoose.model('Form', formSchema);
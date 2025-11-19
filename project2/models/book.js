const mongoose = require('mongoose');

// Book collection with >= 7 fields
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
  publisher: { type: String },
  publishedDate: { type: Date },
  pages: { type: Number },
  price: { type: Number },
  language: { type: String },
  summary: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);

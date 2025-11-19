const Book = require('../models/book');

exports.getAllBooks = async (req, res) => {
  const books = await Book.find().populate('author', 'firstName lastName');
  res.json(books);
};

exports.getBook = async (req, res) => {
  const book = await Book.findById(req.params.id).populate('author', 'firstName lastName');
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
};

exports.createBook = async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.status(201).json(book);
};

exports.updateBook = async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
};

exports.deleteBook = async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json({ message: 'Book deleted' });
};

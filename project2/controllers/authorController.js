const Author = require('../models/author');

exports.getAllAuthors = async (req, res) => {
  const authors = await Author.find();
  res.json(authors);
};

exports.getAuthor = async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (!author) return res.status(404).json({ message: 'Author not found' });
  res.json(author);
};

exports.createAuthor = async (req, res) => {
  const author = new Author(req.body);
  await author.save();
  res.status(201).json(author);
};

exports.updateAuthor = async (req, res) => {
  const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!author) return res.status(404).json({ message: 'Author not found' });
  res.json(author);
};

exports.deleteAuthor = async (req, res) => {
  const author = await Author.findByIdAndDelete(req.params.id);
  if (!author) return res.status(404).json({ message: 'Author not found' });
  res.json({ message: 'Author deleted' });
};

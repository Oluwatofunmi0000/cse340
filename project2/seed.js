const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Author = require('./models/author');
const Book = require('./models/book');

const seed = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Author.deleteMany();
    await Book.deleteMany();

    const author = await Author.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      bio: 'A sample author'
    });

    const book = await Book.create({
      title: 'Sample Book',
      isbn: '1234567890123',
      author: author._id,
      publisher: 'Sample Publisher',
      publishedDate: new Date('2020-01-01'),
      pages: 200,
      price: 19.99,
      language: 'English',
      summary: 'A sample summary.'
    });

    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();

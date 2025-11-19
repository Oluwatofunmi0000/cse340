const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const connectDB = async (uri) => {
  if (!uri) {
    throw new Error('MONGO_URI is required');
  }
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('Connected to MongoDB');
};

module.exports = connectDB;

const mongoose = require('mongoose');
require('dotenv').config();

//  pull schema from the mongoose object
const { Schema } = mongoose;

// DB link for books data.
const book_db_URI = `${process.env.BOOKS_DB}`;

// const URI = process.env.MONGO_URI || myURI;

// connect the database, if error, log will be sent to the terminal
mongoose.connect(book_db_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected!!!********* Books Database is live!!!'))
  .catch((err) => console.log('Connection Error ', err));


//  Schema for the database
const BooksSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  numberOfPages: {
    type: Number,
    required: false,
  },
  publisher: {
    type: String,
    required: false,
  },
});

// Database Model creation to be exported
const booksModel = mongoose.model('booksModel', BooksSchema);

module.exports = booksModel;

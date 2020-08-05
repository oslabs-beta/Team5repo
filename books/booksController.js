const booksModel = require("./booksModel.js");
const booksController = {};

booksController.createBook = async (book) => {
  return await booksModel
    .create(book)
    .then((response) => response)
    .catch((error) => {
      console.log("ERROR from createBook controller : ", error);
      return "error";
    });
};

booksController.deleteBook = async (bookId) => {
  return await booksModel
    .findOneAndDelete(bookId)
    .then((response) => response)
    .catch((error) => {
      console.log("ERROR from deleteBook controller : ", error);
      return "error";
    });
};

booksController.getBookByID = async (bookId, callback) => {
  return await booksModel
    .findOne(bookId)
    .then((response) => response)
    .catch((error) => {
      console.log("ERROR from getBookbyID controller : ", error);
      return "error";
    });
};

// GET RECENT BOOK FIRST!
booksController.getBooks = async () => {
  return await booksModel
    .find({})
    .then((response) => {
      let arr = [];
      for (let i = 0; i < response.length; i++) {
        arr.push({
          title: response[i].title,
          author: response[i].author,
          numberOfPages: response[i].numberOfPages,
          publisher: response[i].publisher,
          bookId: response[i].bookId,
        });
      }
      return arr;
    })
    .catch((error) => {
      console.log("ERROR from the getBooks controller : ", error);
    });
};

module.exports = booksController;

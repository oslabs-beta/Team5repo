const booksModel = require('./booksModel.js');
const booksController = {};


// controller Creates Books
booksController.createBook = (book) => {
    booksModel.create(book,(error, result) => {
      if (error) console.log('there was an error from the books controller create book function  :  ', error);
    });
};


// controller deletes book
booksController.deleteBook = (bookID, res, next) => {
  const { id } = bookID;
  booksModel.findOneAndDelete({ id: id }, (error, result) => {
    if (error) console.log('there was an error from the books controller delete book function  :  ', error);
  });
};

booksController.getBookByID = (sampleID, callback, res, next) => {
  const { id } = sampleID;
  booksModel.findOne({id: id}, (error, result) => {
    if (error) console.log('there was an error from the books controller get books by id function  :  ', error);
    callback(
      null,
      {
        title: result.title,
        author: result.author,
        numberOfPages: result.numberOfPages,
        publisher: result.publisher,
        id: result.id
      }
    )
  })
}

// controller gets all books in the book db
booksController.getBooks = (callback) => {
  booksModel.find({},(error, result) => {
    if (error) console.log('there was an error from the books controller get book function  :  ', error);
    console.log('received resposne from mongodb results ', result)
    const arr = [];
    for( let i = 0; i < result.length; i++){
      arr.push({
        title: result[i].title, 
        author: result[i].author,
        numberOfPages: result[i].numberOfPages,
        publisher: result[i].publisher,
        id: result[i].id
      })            
    }
    callback(
      null,
      {
        books: arr
      }
    )
  });
};

module.exports = booksController;
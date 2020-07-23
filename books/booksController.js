const booksModel = require('./booksModel.js');
const booksController = {};


// controller Creates Books
booksController.createBook = (sampleAdd, res, next) => {
    booksModel.create(sampleAdd, (err, result) => {
      if (err) {
        console.log(`This is the error I am getting back ${err}`);
        return res.send(404).json(err);
      }
    });
};


// controller deletes book
booksController.deleteBook = (sampleDelete, res, next) => {
  console.log(sampleDelete)
  const { id } = sampleDelete;
  booksModel.findOneAndDelete({ id: id }, (error, result) => {
    if (error) {
      console.log(`Deletion was not successful ${error}`);
      return res.status(404).json(error);
    }
  });
};


// controller gets all books in the book db
booksController.getBooks = (callback) => {
  booksModel.find({},(err, result) => {
    if (err) {
      console.log('Book retrieval was not successful', err);
      return res.status(404).json(err);
    }

    const arr = [];
    for( let i=0; i<result.length;i++){
      arr.push({
        title: result[i].title, 
        author: result[i].author,
        numberOfPages: result[i].numberOfPages,
        publisher: result[i].publisher,
        id: result[i].id
      })
    }
//***********IMPORTANT: MAKE SURE WHEN YOU'RE SENDING DATA BACK TO THE CLIENT THAT YOU ARE FOLLOWING THE PROTOFILE FORMAT EXACTLY!!!

    callback(
      null,
      {
        books: arr
      }
    )
  });
};

module.exports = booksController;
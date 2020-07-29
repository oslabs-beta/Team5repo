const bookStub = require("./stubs/booksStub.js");

console.log('process.env vars', process.env.function);

//hard coding a book to test out CreateBook
const book = {
  title: 'ITttttt', 
  author: 'Stephen King',
  numberOfPages: 666,
  publisher: 'Random House',
  id: 100
};

//hard coding id# to test out DeleteBook
const id = {id:100};

const callback = (error, data) => {
  console.log('call to callback')
  if (error) console.log('sorry, there was an error', error)
  else console.log('data coming back to bookInitiator: ', data)
}

const getData = (functionName) => {
  if (functionName === 'CreateBook') return book
  else if (functionName === 'GetBooks') return {}
  else if (functionName === 'DeleteBook') return id;
  else if(functionName === 'GetBookByID') return id;
}
function main (functionName) { 
  bookStub[functionName](getData(functionName), callback);
}
main(process.env.function);
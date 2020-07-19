const bookStub = require("./stubs/booksStub.js");

console.log('process.env vars', process.env.function);

const book = {
  title: 'Harry Potter', 
  author: 'J.K Rowlings',
  pages: 100,
  publisher: 'Random House',
  id: 1
};

const id = 1;

const callback = (error, data) => {
  console.log('call to callback')
  if (error) console.log('sorry, there was an error', error)
  else console.log('data', data)
}

const getData = (functionName) => {
  if (functionName === 'CreateBook') return book
  else if (functionName === 'GetBooks') return {}
  else if (functionName === 'DeleteBook') return id;
}
function main (functionName) { 
  bookStub[functionName](getData(functionName), callback);
}
main(process.env.function);
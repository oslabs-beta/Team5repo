const booksStub = require('./stubs/booksStub.js');
const customersStub = require('./stubs/customersStub.js');
const grpc = require("grpc");
const horusTracer = require('./horus.js');


const book = {
  title: 'ITttttt', 
  author: 'Stephen King',
  numberOfPages: 666,
  publisher: 'Random House',
  id: 200
};

const customer = {
    id: '123',
    name: 'Lily', 
    age: 23,
    address: 'Blablabla',
  }

let ht = new horusTracer('main');


function main() {
    ht.start('books');
    booksStub.CreateBook(book, (error, response) => {
        ht.end();
        // console.log("traceeee ", ht.allRequests);
    }).on('metadata', metadata => {
        setTimeout(() => {
            ht.grabTrace(metadata.get('response')[0]);
            // console.log("traceeee ", ht.allRequests);
            ht.displayRequests();
            ht.writeToFile();
        }, 2000);
    });

    ht.start('customers');
    customersStub.CreateCustomer(customer, (error, response) => {
        ht.end();
    }).on('metadata', metadata => {
        setTimeout(() => {
            ht.grabTrace(metadata.get('response')[0]);
            ht.displayRequests();
            ht.writeToFile();
        }, 2000);
    });

    // booksStub.GetBooks({}, (error, response) => {
    //     ht.end();
    //     // console.log("traceeee ", ht.allRequests);
    // }).on('metadata', metadata => {
    //     setTimeout(() => {
    //         ht.grabTrace(metadata.get('response')[0]);
    //         // console.log("traceeee ", ht.allRequests);
    //         ht.displayRequests();
    //         ht.writeToFile();
    //     }, 2000);
    // });
}

main();
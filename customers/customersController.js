const customersModel = require("./customersModel.js");
const customersController = {};
const path = require('path');
const booksStub = require(path.join(__dirname, "../stubs/booksStub.js"));
const grpc = require('grpc')
// const booksStub = require("../stubs/booksStub.js");

const horusTracer = require("../horus/horus.js");

let ht = new horusTracer("customers");

// Controller create customer
customersController.createCustomer = (sampleAdd) => {
  customersModel.create(sampleAdd, (error, result) => {
    if (error) console.log('there was an error writing to the mongo db from the createCustomer controller function  :  ', error);
  });
};

//**********/may have to add id for customer in protofile

// controller deletes customer
customersController.deleteCustomer = (id) => {
  customersModel.findOneAndDelete({ id: id }, (error, result) => {
    if (error) {
      console.log('there was an error writing to the mongo db from the deleteCustomer controller function  :  ', error);
    }
  });
};

// controller gets all customers in the book db
customersController.getCustomer = (callback, call) => {
  const id = call.request.id;
  customersModel.findOne({id: id}, (err, result) => {

    function gettingBooks(error, data) {
      ht.end();
      if (error) console.log("sorry, there was an error", error);      

      const customerObj = {};
      customerObj.id = result.id;
      customerObj.name = result.name;
      customerObj.age = result.age;
      customerObj.address = result.address;
      customerObj.favBook = data;

      callback(
        null, 
        customerObj
      );
    }
    const favBookId = {id: 100};
    ht.start('books', call);
    booksStub
      .GetBookByID(favBookId, gettingBooks)
      .on("metadata", (metadata) => {
        ht.grabTrace(metadata.get('response')[0])
      });
  });
};

module.exports = customersController;

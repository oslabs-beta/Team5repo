//initiator.js files are a way for us to use these functions without using the browser on the front end.
const customerInitiator = {};
const customerStub = require("./stubs/customersStub.js");

console.log('process.env vars', process.env.function);

customerInitiator.createCustomer = (req, res, next) => {
  const customer = {
    id: req.body.id,
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
    favBookId: req.body.favBookId
  };

  const callback = (error, data) => {
    console.log('call to callback')
    if (error) console.log('sorry, there was an error', error)
  
    console.log('logging data.names ', data.names)
    console.log('logging favorite books ', data.names[0].favBook)
  }
  customerStub['CreateCustomer'](customer, callback);
}

//temporarily hardcoding a test customer until we can update customer info dynamically.
// const customer = {
//   id: 302,
//   name: 'DOG',
//   age: 100,
//   address: 'Nowhereville',
//   favBookId: 200
// };

const id = {id: 302};

const callback = (error, data) => {
  console.log('call to callback')
  if (error) console.log('sorry, there was an error', error)

  console.log('logging data.names ', data.names)
  console.log('logging favorite books ', data.names[0].favBook)
}

const getData = (functionName) => {
  if (functionName === 'CreateCustomer') return customer;
  else if (functionName === 'GetCustomers') return {};
  else if (functionName === 'DeleteCustomer') return id;
}

function main (functionName) { 
  customerStub[functionName](getData(functionName), callback);
}

main(process.env.function);
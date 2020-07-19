const PROTO_PATH = '../protos/customers.proto';
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

//packageDefinition loads the protofile and defines some settings of how we want our data to load.
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true
})

/*
Load a gRPC package definition as a gRPC object hierarchy

@param packageDef — The package definition object

@return — The resulting gRPC object
*/
const customersProto = grpc.loadPackageDefinition(packageDefinition);

//uuid generates a unique identifier 
//use this to generate id's for items in the database
const { v4: uuidv4 } = require("uuid");

const server = new grpc.Server();

server.addService(customersProto.CustomersService.service, {
  CreateCustomer: (call, callback) => {
    console.log('call to CreateCustomer')

    //This is where we will put the logic to create a customer in the database

    callback(
      null,
      {
        name: 'name', //strings 'name', 'age', 'address' are place holders until we pass in variables from front-end
        age: 'age',
        address: 'address',
      }
    );
  },
  GetCustomers: (call, callback) => {
    console.log('call to GetCustomer')

    //logic to read from database

    callback(
      null,
      {
        names: '[CustomerList]'
      }
    );
  },
  DeleteCustomer: (call, callback) => {
    console.log('call to DeleteCustomer')

    //logic to delete customer from Database

    callback(
      null,
      {
        id: 'id number'
      }
    );
  }
});

server.bind("127.0.0.1:6000", grpc.ServerCredentials.createInsecure());
console.log("customerServer.js running at http://127.0.0.1:6000");

console.log('call from customer server')

server.start();
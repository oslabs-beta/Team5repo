const path = require("path");
// const PROTO_PATH = '../protos/books.proto';
const PROTO_PATH = path.join(__dirname, "../protos/customers.proto");
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const express = require('express');
const controller = require('./customersController.js');
const app = express();
app.use(express.json());

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

//sample will take the call information from the client(stub)
    const sampleAdd= {
      id: call.request.id,
      name: call.request.name,
      age: call.request.age,
      address: call.request.address,
    }
//this actually sends data to customersController.
   controller.createCustomer(sampleAdd);

   let meta = new grpc.Metadata();
   meta.add('response', 'none');
   call.sendMetadata(meta);
    callback(
      null,
      {
        id: `completed for ${call.request.id}`,
        name: `completed for ${call.request.name}`, //strings 'name', 'age', 'address' are place holders until we pass in variables from front-end
        age: `completed for ${call.request.name}`,
        address: `completed for ${call.request.address}`,
      }
    );
  },
  GetCustomers: (call, callback) => {
    console.log('call to GetCustomer')

    //logic to read from database
    controller.getCustomers(callback);
    
  },
  DeleteCustomer: (call, callback) => {
    console.log('call to DeleteCustomer')

    const sampleDelete= {      
      id: call.request.id
    }
    //logic to delete customer from Database
    controller.deleteCustomer(sampleDelete);

    callback(
      null, {message: 'CUSTOMER DELETED'}
    );
  }
});

server.bind("127.0.0.1:6000", grpc.ServerCredentials.createInsecure());
console.log("customerServer.js running at http://127.0.0.1:6000");

console.log('call from customer server')

server.start();
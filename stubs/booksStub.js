//use this for bookInitiator
const path = require('path');
const PROTO_PATH = path.join(__dirname, "../protos/books.proto");

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true
});

const BooksService = grpc.loadPackageDefinition(packageDefinition).BooksService;

// potential issues to fix 1) making localhost port dynamic 2) docker containerization may cause conflict

const client = new BooksService (
  "localhost:30043",
  grpc.credentials.createInsecure()
);

console.log("Creating stub inside booksStub");
module.exports = client;
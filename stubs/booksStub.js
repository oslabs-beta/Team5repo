const PROTO_PATH = "./protos/books.proto";

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

module.exports = client;
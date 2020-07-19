const PROTO_PATH = "./protos/customers.proto";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
  });

const CustomersService = grpc.loadPackageDefinition(packageDefinition).CustomersService;

// potential issues to fix 1) making localhost port dynamic 2) docker containerization may cause conflict

const client = new CustomersService (
  "localhost:6000",
  grpc.credentials.createInsecure()
);

module.exports = client;
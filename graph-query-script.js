var { graphql, buildSchema } = require("graphql");

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String,
    hello2: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    // connect DB here
    return "Hello world!";
  },
  hello2: async () => {
    // connect DB here
    await waitFor(3000);
    return "Hello world! 2222 ";
  },
};

const waitFor = (ms) => new Promise((r) => setTimeout(r, ms));

// Run the GraphQL query '{ hello }' and print out the response
graphql(schema, "{ hello, hello2 }", root).then((response) => {
  console.log(response);
});

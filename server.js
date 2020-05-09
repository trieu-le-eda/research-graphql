// var express = require('express');
// var graphqlHTTP = require('express-graphql');
// var { buildSchema } = require('graphql');

// // Construct a schema, using GraphQL schema language
// var schema = buildSchema(`
//   type Query {
//     quoteOfTheDay: String
//     random: Float!
//     rollThreeDice: [Int]
//   }
// `);

// // The root provides a resolver function for each API endpoint
// var root = {
//   quoteOfTheDay: () => {
//     return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
//   },
//   random: () => {
//     return Math.random();
//   },
//   rollThreeDice: () => {
//     return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
//   },
// };

// var app = express();
// app.use('/graphql', graphqlHTTP({
//   schema: schema,
//   rootValue: root,
//   graphiql: true,
// }));
// app.listen(4000);
// console.log('Running a GraphQL API server at localhost:4000/graphql');

// var express = require('express');
// var graphqlHTTP = require('express-graphql');
// var { buildSchema } = require('graphql');

// // Construct a schema, using GraphQL schema language
// var schema = buildSchema(`
//   type Query {
//     rollDice(numDice: Int!, numSides: Int): [Int]
//   }
// `);

// // The root provides a resolver function for each API endpoint
// var root = {
//   rollDice: ({numDice, numSides}) => {
//     var output = [];
//     for (var i = 0; i < numDice; i++) {
//       output.push(1 + Math.floor(Math.random() * (numSides || 6)));
//     }
//     return output;
//   }
// };

// var app = express();
// app.use('/graphql', graphqlHTTP({
//   schema: schema,
//   rootValue: root,
//   graphiql: true,
// }));
// app.listen(4000);
// console.log('Running a GraphQL API server at localhost:4000/graphql');

var express = require("express");
var graphqlHTTP = require("express-graphql");
var { buildSchema } = require("graphql");

// Construct a schema, using GraphQL schema language
// TODO: FE and BE and DB will work together to finalize the good schema for both sides
// TODO FE will use this information in query section to make a query
// Entry point from the outside

// the tasks will be
// 1 design database
// 2 design basic schema the same with database <-- wonder is there any tools to do this tedious tasks?
// 3 when we have a basic schema, get though the design, we can design the higher schema to specific feature
var schema = buildSchema(`
  type UserServiceSDL {
    name: String!
    age: Int!
  }
  type TestObject {
    test1: String
    test2: Int
    test3: [String]
  }
  type PaymentServiceSDL {
    user_id: String
    transaction_list: [Int]
    getObject: TestObject
  }
  type CommonSDL {
    name: String!
    user_id: String!
    transaction_list: [Int]
  }
  

  type Query {
    getUserData(userId: String): UserServiceSDL
    getPaymentData: PaymentServiceSDL
    getDataFromMultipleServices: CommonSDL
    getNewData: String
    ip: String
  }
  type Mutation {
    insertUpdateData(message: String): String
  }
`);

// BE codebase, structure folder, design pattern, utils, tá lả
// This class implements the RandomDie GraphQL type
class UserServices {
  constructor(userId) {
    console.log(`User Id ${userId} is calling a request to server`);
    this.userId = userId;
  }
  // Detailed Design following spec here
  getUserData() {
    console.log("Make a DB query...");
    return {
      user_id: this.userId,
      name: "AAA",
      age: 12,
    };
  }
  name = () => {
    return "AAAAAA";
  };
  age = () => {
    return 123;
  };
}

class PaymentServices {
  constructor(userId) {
    this.userId = userId;
  }
  transaction_list = () => {
    return [123, 34, 56, 658];
  };
  user_id = () => {
    return this.userId;
  };
  getObject = () => {
    return {
      test1: "111",
      test2: 23,
      test3: [3, 434, 5, "dfgdfg"],
    };
  };
}

// The root provides the top-level API endpoints
// TODO BE logic here
// For example
// You can make a API request to legency system
// connect to microservice here
// connect to 3rd party: trigger lambda, email, tá lả
// the User don't know everything here, they just know only 1 endpoint and fields that they knew
var root = {
  getUserData: ({ userId }) => {
    // Validation here or in middleware else
    return new UserServices(userId || null);
  },
  getPaymentData: () => {
    // Validation here or in middleware else
    return new PaymentServices(null);
  },
  getDataFromMultipleServices: () => {
    const userService = new UserServices("test11111");
    const paymentService = new PaymentServices("test2222");
    return {
      name: userService.name,
      user_id: paymentService.user_id(),
      transaction_list: paymentService.transaction_list(),
    };
  },
  insertUpdateData: ({ message }) => {
    fakeDatabase.message = message;
    return message;
  },
  getNewData: () => {
    return fakeDatabase.message;
  },
  ip: function (args, request) {
    return request.ip;
  }
};

var fakeDatabase = {
  message: "original data"
};

const loggingMiddleware = (req, res, next) => {
  console.log('ip:', req.ip);
  next();
}

var app = express();
app.use(loggingMiddleware);
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(4000);
console.log("Running a GraphQL API server at localhost:4000/graphql");

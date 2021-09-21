'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.apolloServer = exports.database = void 0;
const apollo_server_express_1 = require('apollo-server-express');
exports.database = {
  books: [],
};
const typeDefs = apollo_server_express_1.gql`
  type Query {
    books(first: Int, skip: Int): [Book!]!
  }
  type Book {
    title: String!
    author: String!
  }
  type Mutation {
    createBook(title: String!, author: String!): Book!
  }
`;
const resolvers = {
  Query: {
    books: (parent, { first = 10, skip = 0 }) => {
      if (first < 0) {
        throw new apollo_server_express_1.UserInputError(
          '`first` must be a positive integer'
        );
      }
      return exports.database.books.slice(skip, skip + first);
    },
  },
  Mutation: {
    createBook(parent, { title, author }) {
      exports.database.books.push({ title, author });
      return exports.database.books[exports.database.books.length - 1];
    },
  },
};
exports.apolloServer = new apollo_server_express_1.ApolloServer({
  typeDefs,
  resolvers,
});

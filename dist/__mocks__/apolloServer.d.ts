import { ApolloServer } from 'apollo-server-express';
export interface Book {
  title: string;
  author: string;
}
export declare const database: {
  books: Book[];
};
export declare const apolloServer: ApolloServer<import('apollo-server-express').ExpressContext>;

import { ApolloServer } from 'apollo-server-express';
import { DocumentNode, ExecutionResult } from 'graphql';
import { RequestOptions, ResponseOptions } from 'node-mocks-http';
export declare type StringOrAst = string | DocumentNode;
export declare type Options<T extends object> = {
  variables?: T;
};
export declare type TestClientConfig = {
  apolloServer: ApolloServer;
  extendMockRequest?: RequestOptions;
  extendMockResponse?: ResponseOptions;
};
export declare type TestQuery = <T extends object = {}, V extends object = {}>(
  operation: StringOrAst,
  options?: Options<V>
) => Promise<ExecutionResult<T>>;
export declare type TestSetOptions = (options: {
  request?: RequestOptions;
  response?: ResponseOptions;
}) => void;
export declare function createTestClient({
  apolloServer,
  extendMockRequest,
  extendMockResponse,
}: TestClientConfig): {
  query: TestQuery;
  mutate: TestQuery;
  setOptions: TestSetOptions;
};

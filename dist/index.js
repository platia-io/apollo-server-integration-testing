'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.createTestClient = void 0;
const apollo_server_core_1 = require('apollo-server-core');
const express_1 = __importDefault(require('express'));
const graphql_1 = require('graphql');
const node_mocks_http_1 = __importDefault(require('node-mocks-http'));
const mockRequest = (options = {}) =>
  node_mocks_http_1.default.createRequest(
    Object.assign({ method: 'POST' }, options)
  );
const mockResponse = (options = {}) =>
  node_mocks_http_1.default.createResponse(options);
function createTestClient({
  apolloServer,
  extendMockRequest = {},
  extendMockResponse = {},
}) {
  const app = express_1.default();
  apolloServer.applyMiddleware({ app });
  let mockRequestOptions = extendMockRequest;
  let mockResponseOptions = extendMockResponse;
  const setOptions = ({ request, response }) => {
    if (request) {
      mockRequestOptions = request;
    }
    if (response) {
      mockResponseOptions = response;
    }
  };
  const test = (operation, { variables } = {}) =>
    __awaiter(this, void 0, void 0, function* () {
      const req = mockRequest(mockRequestOptions);
      const res = mockResponse(mockResponseOptions);
      const graphQLOptions = yield apolloServer.createGraphQLServerOptions(
        req,
        res
      );
      const { graphqlResponse } = yield apollo_server_core_1.runHttpQuery(
        [req, res],
        {
          method: 'POST',
          options: graphQLOptions,
          query: {
            query:
              typeof operation === 'string'
                ? operation
                : graphql_1.print(operation),
            variables,
          },
          request: apollo_server_core_1.convertNodeHttpToRequest(req),
        }
      );
      return JSON.parse(graphqlResponse);
    });
  return {
    query: test,
    mutate: test,
    setOptions,
  };
}
exports.createTestClient = createTestClient;

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
Object.defineProperty(exports, '__esModule', { value: true });
const apolloServer_1 = require('../__mocks__/apolloServer');
const __1 = require('../');
describe('createTestClient', () => {
  const GET_BOOKS = `query GetBooks($first: Int, $skip: Int) {
    books(first: $first, skip: $skip) {
      title
      author
    }
  }`;
  const CREATE_BOOK = `mutation CreateBook($title: String!, $author: String!) {
    createBook(title: $title, author: $author) {
      title
      author
    }
  }`;
  beforeAll(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield apolloServer_1.apolloServer.start();
    })
  );
  beforeEach(() => {
    apolloServer_1.database.books = [
      {
        title: 'The Awakening',
        author: 'Kate Chopin',
      },
      {
        title: 'City of Glass',
        author: 'Paul Auster',
      },
    ];
  });
  it('should call a query without variables', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const { query } = __1.createTestClient({
        apolloServer: apolloServer_1.apolloServer,
      });
      const response = yield query(GET_BOOKS);
      expect(response).toEqual({
        data: { books: apolloServer_1.database.books },
      });
    }));
  it('should call a query with variables', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const { query } = __1.createTestClient({
        apolloServer: apolloServer_1.apolloServer,
      });
      const response = yield query(GET_BOOKS, {
        variables: {
          first: 1,
        },
      });
      expect(response).toEqual({
        data: { books: apolloServer_1.database.books.slice(0, 1) },
      });
    }));
  it('should error when calling a query', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const { query } = __1.createTestClient({
        apolloServer: apolloServer_1.apolloServer,
      });
      const response = yield query(GET_BOOKS, {
        variables: {
          first: -1,
        },
      });
      expect(response).toEqual({
        data: null,
        errors: [
          expect.objectContaining({
            message: '`first` must be a positive integer',
          }),
        ],
      });
    }));
  it('should call a mutation', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const { mutate } = __1.createTestClient({
        apolloServer: apolloServer_1.apolloServer,
      });
      const book = {
        title: 'The Lord of the Rings',
        author: 'J.R. Tolkien',
      };
      const response = yield mutate(CREATE_BOOK, {
        variables: book,
      });
      expect(response).toEqual({ data: { createBook: book } });
    }));
  it('should typecheck', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const { query } = __1.createTestClient({
        apolloServer: apolloServer_1.apolloServer,
      });
      const { data } = yield query(GET_BOOKS);
      expect(data.books).toEqual(apolloServer_1.database.books);
    }));
});

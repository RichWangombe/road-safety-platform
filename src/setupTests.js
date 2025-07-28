import 'web-streams-polyfill/dist/polyfill.js';
// Polyfill Headers.fetch Response to ensure MSW transforms correctly in Node 18+ where built-in fetch lacks `headers.all`.
import { Headers as HeadersPolyfill, Request as RequestPolyfill, Response as ResponsePolyfill } from 'headers-polyfill';

// Override global fetch-related constructors with polyfills that MSW expects.
if (typeof global.Headers === 'undefined' || typeof global.Headers.prototype.all === 'undefined') {
  global.Headers = HeadersPolyfill;
}
// Ensure Headers.prototype.all exists (required by MSW v0.49 in Node)
const ensureAll = (HeadersCtor) => {
  if (HeadersCtor && typeof HeadersCtor.prototype.all !== 'function') {
    Object.defineProperty(HeadersCtor.prototype, 'all', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function () {
        const result = {};
        this.forEach((value, name) => {
          result[name] = value;
        });
        return result;
      },
    });
  }
};

// Patch whichever Headers constructors may be in use
ensureAll(global.Headers);
try {
  // Patch undici Headers constructor if available (Node 18 fetch implementation)
  // eslint-disable-next-line global-require
  const { Headers: UndiciHeaders } = require('undici');
  ensureAll(UndiciHeaders);
} catch (e) {
  // undici not available, ignore
}

// Intercept Response.headers getter to ensure returned Headers object has `.all()`
if (typeof global.Response !== 'undefined') {
  const descriptor = Object.getOwnPropertyDescriptor(Response.prototype, 'headers');
  if (descriptor && typeof descriptor.get === 'function') {
    Object.defineProperty(Response.prototype, 'headers', {
      configurable: true,
      enumerable: true,
      get() {
        const headers = descriptor.get.call(this);
        if (headers && typeof headers.all !== 'function') {
          ensureAll(headers.constructor);
        }
        return headers;
      },
    });
  }
}

if (typeof global.Request === 'undefined') {
  global.Request = RequestPolyfill;
}
if (typeof global.Response === 'undefined') {
  global.Response = ResponsePolyfill;
}
import '@testing-library/jest-dom'; 
import { configure } from '@testing-library/react';

import { server } from './mocks/server.js';

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());


// Properly mock window.location.replace
beforeEach(() => {
  if (window.location) {
    delete window.location;
    window.location = {
      replace: jest.fn(),
      href: '',
      origin: '',
      protocol: '',
      host: '',
      hostname: '',
      port: '',
      pathname: '',
      search: '',
      hash: '',
    };
  }
});

// Custom matchers for testing-library
configure({ testIdAttribute: 'data-testid' });

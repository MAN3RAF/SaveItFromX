import test from 'node:test';
import assert from 'node:assert';
import { createRateLimiter } from '../middleware/rateLimit.js';
import { errorHandler } from '../middleware/errorHandler.js';

test('Security - Rate limiter enforces threshold', () => {
  const limiter = createRateLimiter(60000, 2, 'test-rate');
  let statusResult: number | null = null;
  let nextCalled = 0;

  const mockReq: any = {
    headers: { 'x-forwarded-for': '203.0.113.195' },
    socket: {},
  };
  const mockRes: any = {
    status: (code: number) => {
      statusResult = code;
      return { json: () => {} };
    },
  };
  const mockNext = () => {
    nextCalled++;
  };

  // Request 1: Allowed
  limiter(mockReq, mockRes, mockNext);
  assert.strictEqual(nextCalled, 1);

  // Request 2: Allowed
  limiter(mockReq, mockRes, mockNext);
  assert.strictEqual(nextCalled, 2);

  // Request 3: Blocked (429)
  limiter(mockReq, mockRes, mockNext);
  assert.strictEqual(nextCalled, 2);
  assert.strictEqual(statusResult, 429);
});

test('Security - Error handler hides internal stack trace from client', () => {
  let statusCode = 0;
  let responseBody: any = null;

  const mockRes: any = {
    status: (code: number) => {
      statusCode = code;
      return {
        json: (data: any) => {
          responseBody = data;
        },
      };
    },
  };

  const sensitiveError = new Error('Database password failed at line 140 /etc/secrets');
  (sensitiveError as any).status = 500;
  (sensitiveError as any).code = 'DB_ERROR';

  errorHandler(sensitiveError, {} as any, mockRes, () => {});

  assert.strictEqual(statusCode, 500);
  assert.ok(responseBody?.error);
  assert.strictEqual(responseBody?.error.code, 'DB_ERROR');
  assert.strictEqual(responseBody?.error.stack, undefined, 'Stack trace must NEVER be included in response');
});

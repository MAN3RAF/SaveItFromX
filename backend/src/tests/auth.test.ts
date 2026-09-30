import test from 'node:test';
import assert from 'node:assert';
import {
  hashPassword,
  verifyPassword,
  createSession,
  validateSession,
  destroySession,
  getCookieOptions,
} from '../services/auth/tokenService.js';
import { AdminUser } from '../types/index.js';

test('Auth Service - Password hashing with bcrypt', async () => {
  const password = 'SuperSecretAdminPassword123!';
  const hash = await hashPassword(password);

  assert.ok(hash, 'Hash should be generated');
  assert.ok(hash.startsWith('$2a$') || hash.startsWith('$2b$'), 'Hash should be standard bcrypt format');

  const valid = await verifyPassword(password, hash);
  assert.strictEqual(valid, true, 'Correct password must verify successfully');

  const invalid = await verifyPassword('WrongPassword!', hash);
  assert.strictEqual(invalid, false, 'Incorrect password must be rejected');
});

test('Auth Service - Cookie options configuration', () => {
  const options = getCookieOptions();
  assert.strictEqual(options.httpOnly, true, 'Cookie must be HttpOnly');
  assert.strictEqual(options.path, '/', 'Cookie path must be root');
  assert.ok(options.maxAge > 0, 'Cookie must have positive expiration');
});

test('Auth Service - Session creation and validation cycle', async () => {
  const mockUser: AdminUser = {
    id: 'usr_test_123',
    email: 'admin@saveitfromx.com',
    username: 'SuperAdmin',
    role: 'superadmin',
  };

  const sessionId = await createSession(mockUser);
  assert.ok(sessionId, 'Session ID should be created');
  assert.strictEqual(typeof sessionId, 'string');
  assert.strictEqual(sessionId.length, 64, 'Session ID should be 32 bytes in hex (64 chars)');

  const retrieved = await validateSession(sessionId);
  assert.ok(retrieved, 'Should retrieve active session');
  assert.strictEqual(retrieved?.id, mockUser.id);
  assert.strictEqual(retrieved?.email, mockUser.email);

  await destroySession(sessionId);
  const afterDestroy = await validateSession(sessionId);
  assert.strictEqual(afterDestroy, null, 'Destroyed session must be invalidated');
});

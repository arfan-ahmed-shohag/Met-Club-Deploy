import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const compile = (source) => 'data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText).toString('base64');
const core = compile(readFileSync(new URL('../src/utils/userValidation.ts', import.meta.url), 'utf8'));
const locations = JSON.parse(readFileSync(new URL('../src/data/bangladesh-locations.json', import.meta.url), 'utf8'));
const source = readFileSync(new URL('../src/utils/profileValidation.ts', import.meta.url), 'utf8')
  .replace('import locations from "../data/bangladesh-locations.json";', `const locations = ${JSON.stringify(locations)};`)
  .replace('"./userValidation"', JSON.stringify(core));
const { validateProfile, normalizeProfile, validatePasswordChange, validateProfilePhoto } = await import(compile(source));
const valid = { fullName: 'Amina Karim', institution: 'Test School', class: '7', guardianPhone: '01712345678', division: 'ঢাকা', district: 'ঢাকা', thana: 'ধানমন্ডি' };

test('profile validates required fields and dependent location values', () => {
  assert.deepEqual(validateProfile(valid), {});
  for (const [field, value] of [['fullName', ''], ['guardianPhone', '01212345678'], ['class', '13'], ['class', ''], ['institution', ''], ['division', 'invalid'], ['district', 'কুমিল্লা'], ['thana', 'invalid']]) {
    assert.equal(typeof validateProfile({ ...valid, [field]: value })[field], 'string', field);
  }
  assert.deepEqual(validateProfile({ ...valid, division: '', district: '', thana: '' }, false), {}, 'legacy accounts may update unrelated details without an address');
  assert.equal(normalizeProfile({ ...valid, fullName: ' Amina   Karim ', guardianPhone: '+৮৮০ ১৭১২-৩৪৫৬৭৮' }).guardianPhone, '01712345678');
  assert.equal(normalizeProfile(valid).class, 7);
});
test('password change allows existing short passwords and validates new password and confirmation', () => {
  assert.deepEqual(validatePasswordChange({ currentPassword: 'abc123', newPassword: 'newPassword123', confirmPassword: 'newPassword123' }), {});
  assert.ok(validatePasswordChange({ currentPassword: '', newPassword: 'short', confirmPassword: 'other' }).currentPassword);
  assert.ok(validatePasswordChange({ currentPassword: 'oldPassword', newPassword: 'short', confirmPassword: 'short' }).newPassword);
  assert.ok(validatePasswordChange({ currentPassword: 'oldPassword', newPassword: 'oldPassword', confirmPassword: 'oldPassword' }).newPassword);
  assert.ok(validatePasswordChange({ currentPassword: 'oldPassword', newPassword: 'newPassword', confirmPassword: 'different' }).confirmPassword);
});
test('avatar upload rejects empty, oversized, SVG and other non-image files', () => {
  assert.equal(validateProfilePhoto({ type: 'image/png', size: 100 }), null);
  assert.equal(validateProfilePhoto({ type: 'image/webp', size: 2 * 1024 * 1024 }), null);
  for (const file of [{ type: 'image/png', size: 0 }, { type: 'image/png', size: 2 * 1024 * 1024 + 1 }, { type: 'image/svg+xml', size: 10 }, { type: 'text/plain', size: 10 }]) assert.equal(typeof validateProfilePhoto(file), 'string');
});

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/utils/userValidation.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const validation = await import("data:text/javascript;base64," + Buffer.from(compiled).toString("base64"));

test("names accept Bangla and ordinary name punctuation and reject missing/invalid names", () => {
    for (const name of ["রাহেলা বেগম", "Md. Arfan", "Anne-Marie O'Neil"]) assert.equal(validation.validateName(name), true);
    for (const name of [undefined, "", " ", "A", "12345", "<script>", "A".repeat(101)]) assert.notEqual(validation.validateName(name), true);
    assert.equal(validation.normalizeName("  রাহেলা   বেগম  "), "রাহেলা বেগম");
});

test("emails are normalized and invalid domains/local parts are rejected", () => {
    for (const email of ["person@example.com", "Student+club@School.edu.bd", " FIRST.LAST@EXAMPLE.COM "]) assert.equal(validation.validateEmail(email), true);
    for (const email of [undefined, "", "name", "a@localhost", "a@bad..com", "a@-bad.com", ".a@example.com", "a..b@example.com", "a@b.c", "a b@example.com"]) assert.notEqual(validation.validateEmail(email), true);
    assert.equal(validation.normalizeEmail(" STUDENT@EXAMPLE.COM "), "student@example.com");
});

test("BD mobile numbers normalize local/international formats and Bangla digits", () => {
    for (const phone of ["01712345678", "+8801712345678", "8801712345678", "০১৭১২৩৪৫৬৭৮", " +৮৮০ ১৭১২-৩৪৫৬৭৮ "]) {
        assert.equal(validation.validatePhone(phone), true);
        assert.equal(validation.normalizePhone(phone), "01712345678");
    }
    for (const phone of [undefined, "", "01212345678", "0171234567", "017123456789", "+911712345678", "017abc45678", 1712345678]) assert.notEqual(validation.validatePhone(phone), true);
});

test("new passwords require 8 characters and respect bcrypt's UTF-8 byte limit", () => {
    for (const password of ["abc12345", "a long passphrase", "a".repeat(72), "অ".repeat(24)]) assert.equal(validation.validatePassword(password), true);
    for (const password of [undefined, "", "        ", "1234567", "a".repeat(73), "অ".repeat(25)]) assert.notEqual(validation.validatePassword(password), true);
    assert.equal(validation.validateLoginPassword("abc123"), true, "existing shorter passwords can still log in");
});

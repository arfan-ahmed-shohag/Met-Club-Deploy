import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const storage = new Map(), events = new Map();
globalThis.window = {
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) },
    addEventListener: (type, listener) => events.set(type, listener),
};
const source = readFileSync(new URL("../src/lib/authSession.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const session = await import("data:text/javascript;base64," + Buffer.from(compiled).toString("base64"));
const firstUser = { id: "first", fullName: "প্রথম ব্যবহারকারী", email: "first@example.com", role: "student" };
const secondUser = { id: "second", fullName: "দ্বিতীয় ব্যবহারকারী", email: "second@example.com", role: "admin" };
beforeEach(() => session.clearSession());

test("login and logout immediately publish the matching account state", () => {
    let updates = 0;
    const unsubscribe = session.subscribeAuth(() => updates++);
    session.setSessionToken("first-token");
    assert.equal(session.getAuthSnapshot().isLoading, true);
    assert.equal(session.getAuthSnapshot().user, null);
    session.setCurrentUser(firstUser, session.getSessionVersion());
    assert.equal(session.getAuthSnapshot().user, firstUser);
    session.clearSession();
    assert.equal(session.getAuthSnapshot().accessToken, null);
    assert.equal(session.getAuthSnapshot().user, null);
    assert.equal(storage.has("token"), false);
    assert.equal(updates, 3);
    unsubscribe();
});

test("responses from an older account cannot overwrite or log out the newer account", () => {
    session.setSessionToken("first-token");
    const firstVersion = session.getSessionVersion();
    session.setSessionToken("second-token");
    session.setCurrentUser(secondUser, session.getSessionVersion());
    session.setCurrentUser(firstUser, firstVersion);
    session.setProfileError("old error", firstVersion);
    session.clearSession(firstVersion);
    assert.equal(session.updateSessionToken("old-refresh", firstVersion), false);
    assert.equal(session.getAuthSnapshot().user, secondUser);
    assert.equal(session.getAccessToken(), "second-token");
});

test("refresh preserves the current user's editor while cross-tab account changes clear it", () => {
    session.setSessionToken("first-token");
    const version = session.getSessionVersion();
    session.setCurrentUser(firstUser, version);
    assert.equal(session.updateSessionToken("refreshed-token", version), true);
    assert.equal(session.getAuthSnapshot().user, firstUser);
    assert.equal(session.getAuthSnapshot().isLoading, false);
    assert.equal(storage.get("token"), "refreshed-token");
    session.setCurrentUser(firstUser, version);
    storage.set("token", "second-token");
    events.get("storage")({ key: "token" });
    assert.equal(session.getAccessToken(), "second-token");
    assert.equal(session.getAuthSnapshot().user, null);
    session.setCurrentUser(firstUser, version);
    assert.equal(session.getAuthSnapshot().user, null);
});

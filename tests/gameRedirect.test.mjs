import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../src/utils/gameRedirect.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const { getExternalRedirect, redirectSearch } = await import("data:text/javascript;base64," + Buffer.from(compiled).toString("base64"));

const query = (target) => "?redirect=" + encodeURIComponent(target);

test("login redirects back only to the game over HTTPS", () => {
    assert.equal(getExternalRedirect(query("https://game.meteorologyclub.com")), "https://game.meteorologyclub.com/");
    assert.equal(getExternalRedirect(query("https://game.meteorologyclub.com/play?level=2#top")), "https://game.meteorologyclub.com/play?level=2#top");
});

test("other sites, look-alike hosts and unsafe schemes are ignored", () => {
    for (const target of [
        "https://evil.example.com",
        "https://game.meteorologyclub.com.evil.com",
        "https://evilgame.meteorologyclub.com",
        "https://game.meteorologyclub.com@evil.com",
        "http://game.meteorologyclub.com",
        "javascript:alert(1)",
        "//game.meteorologyclub.com",
        "/admin",
        "not a url",
    ]) assert.equal(getExternalRedirect(query(target)), null, target);
    assert.equal(getExternalRedirect(""), null);
    assert.equal(getExternalRedirect("?other=1"), null);
});

test("the redirect target carries over to another auth page", () => {
    assert.equal(redirectSearch(null), "");
    assert.equal(redirectSearch("https://game.meteorologyclub.com/"), "?redirect=https%3A%2F%2Fgame.meteorologyclub.com%2F");
});

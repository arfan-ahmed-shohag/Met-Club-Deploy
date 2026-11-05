import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/utils/headerNavigation.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const { getHeaderNavigationState, getHeaderChapterLinks } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('About is current only on the Bangla and English home routes and aliases', () => {
    for (const path of ['/', '/en', '/en/', '/about', '/en/about/']) {
        assert.equal(getHeaderNavigationState(path).section, 'about', path);
    }
    for (const path of ['/profile', '/en/profile', '/unknown', '/english']) {
        assert.equal(getHeaderNavigationState(path).section, null, path);
    }
});

test('nested blog pages keep Resources selected without matching similarly named paths', () => {
    for (const path of ['/blogs', '/blogs/12', '/en/blogs/write', '/en/blogs/12/?draft=1#story', '/en/tutorials']) {
        assert.equal(getHeaderNavigationState(path).section, 'resources', path);
    }
    for (const path of ['/blogs-other', '/en/blogspot', '/tutorials-other']) {
        assert.equal(getHeaderNavigationState(path).section, null, path);
    }
});

test('learning and quiz routes preserve the exact active chapter in both languages', () => {
    for (const prefix of ['', '/en']) {
        for (const path of ['/lesson/10', '/start-quiz/10', '/select-difficulty/10', '/quiz/10/easy']) {
            const state = getHeaderNavigationState(`${prefix}${path}`);
            assert.equal(state.section, 'chapters');
            assert.equal(state.chapterId, 10);
        }
        for (const path of ['/start-journey', '/learning-selection', '/learning-zone']) {
            const state = getHeaderNavigationState(`${prefix}${path}`);
            assert.equal(state.section, 'chapters');
            assert.equal(state.chapterId, null);
        }
    }
    assert.equal(getHeaderNavigationState('/lesson/1-other').chapterId, null);
    assert.equal(getHeaderNavigationState('/met-club-module-2').section, 'anticipatory');
});

test('English chapter links retain chapter IDs and fall back individually to Bangla', () => {
    assert.deepEqual(getHeaderChapterLinks(
        [{ id: 10, title: 'বাংলা ১০' }, { id: 1, title: 'বাংলা ১' }, { id: 2, title: 'বাংলা ২' }],
        [{ id: 1, title: 'English 1' }, { id: 10, title: 'English 10' }],
        'en',
    ), [
        { id: 1, title: 'English 1', locale: 'en' },
        { id: 2, title: 'বাংলা ২', locale: 'bn' },
        { id: 10, title: 'English 10', locale: 'en' },
    ]);
});

test('unavailable English metadata uses Bangla links, while an available English list can stand alone', () => {
    assert.deepEqual(getHeaderChapterLinks([{ id: 1, title: 'বাংলা' }], null, 'en'), [{ id: 1, title: 'বাংলা', locale: 'bn' }]);
    assert.deepEqual(getHeaderChapterLinks([], [{ id: 1, title: 'English' }], 'en'), [{ id: 1, title: 'English', locale: 'en' }]);
    assert.deepEqual(getHeaderChapterLinks([], null, 'en'), []);
});

test('Bangla navigation retains its own chapter data and does not invent additional chapters', () => {
    assert.deepEqual(getHeaderChapterLinks([{ id: 1, title: 'বাংলা' }], [{ id: 1, title: 'English' }, { id: 2, title: 'English 2' }], 'bn'), [{ id: 1, title: 'বাংলা', locale: 'bn' }]);
});

const test = require("node:test");
const assert = require("node:assert");
const { calculateLevenshteinDistance } = require("../typosquat_check");

test("distance should return 0", () => {
    const w1 = "lodash";
    const w2 = "lodash";
    const distance = calculateLevenshteinDistance(w1, w2);
    assert.strictEqual(distance, 0);
});

test("distance should return 6", () => {
    const w1 = "lodash";
    const w2 = "express";
    const distance = calculateLevenshteinDistance(w1, w2);
    assert.strictEqual(distance, 6);
});

test("distance should be length of w1", () => {
    const w1 = "express";
    const w2 = "";
    const distance = calculateLevenshteinDistance(w1, w2);
    assert.strictEqual(distance, w1.length);
});

test("distance should be length of w2", () => {
    const w2 = "express";
    const w1 = "";
    const distance = calculateLevenshteinDistance(w1, w2);
    assert.strictEqual(distance, w2.length);
});

test("distance should return 2", () => {
    const w1 = "lodash";
    const w2 = "lodahs";
    const distance = calculateLevenshteinDistance(w1, w2);
    assert.strictEqual(distance, 2);
});

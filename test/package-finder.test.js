const test = require("node:test");
const assert = require("node:assert");
const fn = require("../package_finder");
const path = require("path");

//function should not return an empty list
test("should return a length grater then 0", () => {
    const dic = path.join(__dirname, "testdir/dic2");
    console.log(dic);
    const packagesList = fn.module_finder(dic);
    console.log(packagesList);

    assert.notStrictEqual(packagesList.length, 0);
});
test("should not return undefined", () => {
    const dic = path.join(__dirname, "testdir");
    const packagesList = fn.module_finder(dic);
    assert.notEqual(packagesList, undefined);
});

test("should return a length 0", () => {
    const dic = path.join(__dirname, "testdir/dic1");
    const packagesList = fn.module_finder(dic);
    assert.strictEqual(packagesList.length, 0);
});

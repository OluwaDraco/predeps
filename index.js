const fs = require("fs");
const path = require("path");
const { pkgScriptScan } = require("./install_check");
// user project directory passed as arg
const jsonFile = process.argv[2];
const rawJsonData = fs.readFileSync(jsonFile, "utf-8");
const jsonObject = JSON.parse(rawJsonData);
const passCheck = pkgScriptScan(jsonObject);
console.log(typeof passCheck);
console.log(passCheck);

const fs = require("fs");
const path = require("path");
const { pkgScriptScan } = require("./install_check");
const { module_finder } = require("./package_finder");
// user project directory passed as arg
let results = [];
const projectDic = process.argv[2];
const projectJsonFiles = module_finder(projectDic);
projectJsonFiles.forEach((file) => {
    const rawJsonData = fs.readFileSync(file, "utf-8");
    const jsonObject = JSON.parse(rawJsonData);
    const readableContent = pkgScriptScan(jsonObject);
    results.push({
        filePath: file,
        lifeCycleScript: JSON.stringify(readableContent),
    });
});
console.log(results);

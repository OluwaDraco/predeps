const fs = require("fs");
const path = require("path");

const module_finder = (dir, files = []) => {
    //join path of project
    // const projectPath = path.join(__dirname, dir.toString());
    const fileList = fs.readdirSync(dir, { withFileTypes: true });
    //creates the full path of the file by concat passed dics
    fileList.forEach((file) => {
        //check if file or dic
        if (file.isDirectory()) {
            // Always recurse into directories
            module_finder(`${dir}/${file.name}`, files);
        } else {
            // It's a file - only add if we're inside node_modules
            if (dir.includes("node_modules")) {
                files.push(`${dir}/${file.name}`);
            }
        }
    });
    const newList = target_finder(files);

    return newList;
};

const target_finder = (paths) => {
    return (pathToPackagesJson = paths.filter((path) =>
        path.includes("package.json"),
    ));
};

module.exports = {
    module_finder,
};

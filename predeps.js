const fs = require("fs");
const path = require("path");
const { pkgScriptScan } = require("./install_check");
const { module_finder } = require("./package_finder");
const { calculateLevenshteinDistance } = require("./typosquat_check");
const { TOPPACKAGELIST } = require("./top100");

// user project directory passed as arg
const projectDic = process.argv[2];

if (!projectDic) {
    console.error("Please provide a project directory as argument");
    process.exit(1);
}

const projectJsonFiles = module_finder(projectDic);
const results = [];

projectJsonFiles.forEach((file) => {
    let jsonObject;
    try {
        const rawJsonData = fs.readFileSync(file, "utf-8");
        jsonObject = JSON.parse(rawJsonData);
    } catch (error) {
        console.error(`Skipping invalid JSON file: ${file}`);
        return;
    }

    // Check for lifecycle scripts
    const lifeCycleScripts = pkgScriptScan(jsonObject);
    const hasLifecycleScript = Array.isArray(lifeCycleScripts) && lifeCycleScripts.length > 0;

    // Check for typosquat
    let isTyposquat = false;
    let typosquatMatch = null;

    if (jsonObject.name) {
        for (const popularPkg of TOPPACKAGELIST) {
            const distance = calculateLevenshteinDistance(popularPkg, jsonObject.name);
            if (distance === 1) {
                isTyposquat = true;
                typosquatMatch = popularPkg;
                break;
            }
        }
    }

    // Calculate risk score
    let riskScore = 0;
    if (hasLifecycleScript) riskScore += 1;
    if (isTyposquat) riskScore += 1;

    results.push({
        packageName: jsonObject.name || "unknown",
        version: jsonObject.version || "unknown",
        filePath: file,
        lifeCycleScripts: lifeCycleScripts,
        hasLifecycleScript,
        isTyposquat,
        typosquatMatch,
        riskScore,
    });
});

// Group by risk level
const high = results.filter(r => r.riskScore >= 2);
const medium = results.filter(r => r.riskScore === 1);
const low = results.filter(r => r.riskScore === 0);

// Format output
let output = `Scanned ${results.length} packages in ${projectDic}\n\n`;

if (high.length > 0) {
    output += "HIGH\n";
    high.forEach(pkg => {
        output += `  ${pkg.packageName}@${pkg.version}\n`;
        if (pkg.hasLifecycleScript) {
            pkg.lifeCycleScripts.forEach(script => {
                output += `    ${script.hook}: ${script.command}\n`;
            });
        }
        if (pkg.isTyposquat) {
            output += `    potential typosquat of: ${pkg.typosquatMatch}\n`;
        }
    });
    output += "\n";
}

if (medium.length > 0) {
    output += "MEDIUM\n";
    medium.forEach(pkg => {
        output += `  ${pkg.packageName}@${pkg.version}\n`;
        if (pkg.hasLifecycleScript) {
            pkg.lifeCycleScripts.forEach(script => {
                output += `    ${script.hook}: ${script.command}\n`;
            });
        }
        if (pkg.isTyposquat) {
            output += `    potential typosquat of: ${pkg.typosquatMatch}\n`;
        }
    });
    output += "\n";
}

if (low.length > 0) {
    output += "LOW\n";
    low.forEach(pkg => {
        output += `  ${pkg.packageName}@${pkg.version}\n`;
    });
    output += "\n";
}

// Summary statistics
const packagesWithScripts = results.filter(r => r.hasLifecycleScript).length;
const percentage = ((packagesWithScripts / results.length) * 100).toFixed(1);
output += `${packagesWithScripts} packages ran install scripts out of ${results.length} (${percentage}%)\n`;

// Write to file and console
const outputFile = path.join(process.cwd(), "scan-results.txt");
fs.writeFileSync(outputFile, output);
console.log(output);
console.log(`\nResults written to: ${outputFile}`);

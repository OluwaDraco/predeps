// checks the package.json for scripts that run postintall,preinstall etc

const FLAGS_HOOKS = ["postinstall", "preinstall", "install", "prepare"];
const pkgScriptScan = (pkg) => {
    const packageJson = pkg.scripts || {};
    if (packageJson == undefined) {
        return "seems the script object is missing.";
    }
    return FLAGS_HOOKS.filter((hook) => packageJson[hook]).map((hook) => ({
        hook,
        command: packageJson[hook],
    }));
};

module.exports = {
    pkgScriptScan,
};

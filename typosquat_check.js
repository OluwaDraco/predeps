// get package list list from find_module
//parse/extract [package.name]
//calculate Levenshtein distance against top 100 npm packages(using trending)
//if the above step is 1 - flag
//0 means nothing was changed
const { TOPPACKAGELIST } = require("./top100");

const calculateLevenshteinDistance = (w1, w2) => {
    const rows = w1.length + 1;
    const cols = w2.length + 1;
    const d = Array.from({ length: rows }, () => new Array(cols).fill(0));

    for (let i = 0; i < rows; i++) d[i][0] = i;
    for (let j = 0; j < cols; j++) d[0][j] = j;

    for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
            const cost = w1[i - 1] === w2[j - 1] ? 0 : 1;
            d[i][j] = Math.min(
                // deletion
                d[i - 1][j] + 1,
                // insertion
                d[i][j - 1] + 1,
                // substitution
                d[i - 1][j - 1] + cost,
            );
        }
    }

    return d[w1.length][w2.length];
};

const typoSquatScoreCheck = (popularListPkg, packageName) => {
    const rating = calculateLevenshteinDistance(popularListPkg, packageName);
    if (rating === 0) {
        return { ratingIndex: rating, comment: "Alright" };
    } else if (rating === 1) {
        return { ratingIndex: rating, comment: "potential Flag!" };
    } else {
        return { ratingIndex: null, comment: "" };
    }
};

module.exports = {
    calculateLevenshteinDistance,
};

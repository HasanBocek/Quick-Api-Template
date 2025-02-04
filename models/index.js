const fs = require("fs");
const path = require("path");

const models = {};
const modelsPath = __dirname;

fs.readdirSync(modelsPath).forEach((file) => {
    if (file !== "index.js" && file.endsWith(".js")) {
        const modelName = file.replace(".js", "");
        models[modelName] = require(path.join(modelsPath, file));
    }
});

module.exports = models;
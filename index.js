var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
const ResponseHandler = require('./utilities/ResponseHandler');
const asyncWrapper = require('./middlewares/asyncWrapper');
const validationMiddleware = require('./middlewares/validation');
const servicesPath = path.join(__dirname, "Generator", '../features');
require('module-alias/register');
require('dotenv').config();
require("./config/db");

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

fs.readdirSync(servicesPath).forEach((moduleName) => {
    const controllersPath = path.join(servicesPath, moduleName, 'controllers');
    const validatorsPath = path.join(servicesPath, moduleName, "validators");

    if (!fs.lstatSync(path.join(servicesPath, moduleName)).isDirectory() || !fs.existsSync(controllersPath) || !fs.lstatSync(controllersPath).isDirectory() || fs.readdirSync(controllersPath).length === 0) {
        return;
    }

    console.log(`\n Service: ${moduleName} `);

    fs.readdirSync(controllersPath).forEach(async (file) => {
        if (file.endsWith('.js')) {
            const controller = require(path.join(controllersPath, file));

            let validationConfig = {};
            const bodyValidatorFile = path.join(validatorsPath, "body", file);
            const queryValidatorFile = path.join(validatorsPath, "query", file);
            const paramsValidatorFile = path.join(validatorsPath, "params", file);

            if (fs.existsSync(bodyValidatorFile)) validationConfig.bodySchema = require(bodyValidatorFile);
            if (fs.existsSync(queryValidatorFile)) validationConfig.querySchema = require(queryValidatorFile);
            if (fs.existsSync(paramsValidatorFile)) validationConfig.paramsSchema = require(paramsValidatorFile);

            if (controller.config && controller.run) {
                const method = controller.config.method.toUpperCase();
                const routePath = `/${moduleName}${controller.config.route}`;
                const endpointName = controller.config.name;

                console.log(`   -> ${`[${method}]`.padEnd(8)} ${routePath.padEnd(15)} ${endpointName}`);

                app[controller.config.method.toLowerCase()](
                    routePath,
                    validationMiddleware(validationConfig),
                    asyncWrapper(controller.run)
                );
            }
        }
    });
});

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    return ResponseHandler.error({ res, statusCode: 404, error: ["Server error"] })
});

module.exports = app;
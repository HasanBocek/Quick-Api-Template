const ResponseHandler = require('../utilities/ResponseHandler');

const validationMiddleware = ({ bodySchema, querySchema, paramsSchema }) => async (req, res, next) => {
    try {
        if (paramsSchema) {
            req.validatedParams = await paramsSchema.validateAsync(req.params, { abortEarly: false, context: { req } });
        }
        if (bodySchema) {
            req.validatedBody = await bodySchema.validateAsync(req.body, { abortEarly: false, context: { validatedParams: req.validatedParams } });
        }
        if (querySchema) {
            req.validatedQuery = await querySchema.validateAsync(req.query, { abortEarly: false, context: { req } });
        }

        next();
    } catch (error) {
        return ResponseHandler.error({
            res,
            statusCode: 400,
            message: "Validation Error",
            error: error.details.map((err) => err.message)
        });
    };
}

module.exports = validationMiddleware;
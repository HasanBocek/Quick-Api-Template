const ResponseHandler = require('../utilities/ResponseHandler');

const asyncWrapper = (fn) => async (req, res) => {
    try {
        let result = await fn(req, res);
        if (result) {
            ResponseHandler.success({ res, ...result })
        } else {
            ResponseHandler.error({ res, error: "Server error" });
        }
    } catch (err) {
        ResponseHandler.error({ res, error: "Server error" });
    }
};

module.exports = asyncWrapper;
class ResponseHandler {
    static success({ res, statusCode = 200, message = "Success", data = null }) {
        return res.status(statusCode).json({
            status: "success",
            message,
            data
        });
    }

    static error({ res, statusCode = 500, message = "Internal Server Error", error = [""] }) {
        return res.status(statusCode).json({
            status: "error",
            message,
            error
        });
    }
}

module.exports = ResponseHandler;
const { Model } = require('@models');

exports.config = {
    name: "CREATE_THING",
    route: "/",
    method: "POST",
}

exports.run = async function (req, res, next) {
    const newData = await Model.create(req.validatedBody);
    return { statusCode: 201, message: "Data created successfully", data: newData }
}
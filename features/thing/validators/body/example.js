const Joi = require('joi');
const { Model } = require('@models');

const createModelSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        "string.base": "Name must be a string",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least 3 characters",
        "string.max": "Name cannot be more than 50 characters",
        "any.required": "Name is required"
    }),
    description: Joi.string().optional()
})
    .unknown(false)
    .prefs({ messages: { "object.unknown": "{{#label}} is not allowed in request body" } })
    .external(async (value) => {
        const existingModel = await Modeö.exists({ name: value.name });
        if (existingModel) {
            throw new Joi.ValidationError("Name already exists", [
                { message: "Name already exists", path: ["name"], type: "string.duplicate", context: { key: "name", label: "name" } }
            ]);
        }
        return value;
    });

module.exports = createModelSchema;
const Joi = require('joi');
const mongoose = require('mongoose');
const { Model } = require('@models');

const deleteModelSchema = Joi.object({
    id: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value) || !Model.exists({ _id: value })) {
            return helpers.message("Invalid model ID");
        }
        return value;
    }).required().messages({
        "any.required": "Model ID is required"
    })
});

module.exports = deleteModelSchema;
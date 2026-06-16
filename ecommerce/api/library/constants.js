const stringRequired = { type: String, required: true, trim: true };
const numberRequired = { type: Number, required: true };
const booleanTrue = { type: Boolean, default: true };
const modelConfig = { timestamps: true };

module.exports = { stringRequired, numberRequired, booleanTrue, modelConfig };

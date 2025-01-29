const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const classSchema = new Schema({
    className: { type: String, required: true },
    Description: { type: String, required: true },
}, { timestamps: true });

const ClassModel = mongoose.model('Class', classSchema);

module.exports = ClassModel;


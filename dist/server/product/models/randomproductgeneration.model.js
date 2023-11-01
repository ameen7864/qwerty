"use strict";
const mongoose_1 = require("mongoose");
const { Types: { ObjectId }, } = mongoose_1.Schema;
const schema = new mongoose_1.Schema({
    user: { type: ObjectId, ref: "Users", required: true },
    createdOn: { type: Date, default: new Date() },
}, { timestamps: true });
const RandomProductGenerationModel = (0, mongoose_1.model)("RandomProductGeneration", schema);
module.exports = RandomProductGenerationModel;

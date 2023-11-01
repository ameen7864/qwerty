"use strict";
const mongoose_1 = require("mongoose");
const { Types: { ObjectId }, } = mongoose_1.Schema;
const schema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    enquireFor: { type: String, required: true },
    description: String,
    user: ObjectId,
});
const ContactUsModel = (0, mongoose_1.model)("ContactUs", schema);
module.exports = ContactUsModel;

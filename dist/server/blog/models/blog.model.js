"use strict";
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    title: { type: String },
    subtitle: String,
    description: { type: String },
    isArchived: { type: Boolean, default: false },
    featuredImages: [String],
    metaTitle: String,
    metaDescription: String,
    metaKeywords: String,
}, {
    timestamps: true,
});
const BlogModel = (0, mongoose_1.model)("Blogs", schema);
module.exports = BlogModel;

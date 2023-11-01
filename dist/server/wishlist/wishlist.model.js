"use strict";
const mongoose_1 = require("mongoose");
const { Types: { ObjectId }, } = mongoose_1.Schema;
const schema = new mongoose_1.Schema({
    product: { type: ObjectId, ref: "Products", required: true },
    user: { type: ObjectId, ref: "Users" },
    device: { type: ObjectId, ref: "Devices" },
    isArchived: { type: Boolean, default: false },
});
const WishlistModel = (0, mongoose_1.model)("Wishlists", schema);
module.exports = WishlistModel;

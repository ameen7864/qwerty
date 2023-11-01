"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.archiveBlog = exports.getBlogs = exports.deleteBlog = exports.updateBlog = exports.getBlogById = exports.addBlog = void 0;
const lodash_1 = require("lodash");
const blog_model_1 = __importDefault(require("../models/blog.model"));
const mongoose_1 = require("mongoose");
const addBlog = (req, res) => {
    const { title, subtitle, description, featuredImages, metaTitle, metaDescription, metaKeywords, } = req.body;
    if (!title || !subtitle || !description) {
        return res.send({
            success: false,
            msg: "Please send proper parameters!",
        });
    }
    const blog = new blog_model_1.default({
        title,
        subtitle,
        description,
        featuredImages,
        metaTitle,
        metaDescription,
        metaKeywords,
    });
    blog
        .save()
        .then((result) => {
        res.send({ success: true, msg: "BLOG added!" });
    })
        .catch((error) => {
        res.send({
            success: false,
            msg: "Error while adding BLOG!",
        });
    });
};
exports.addBlog = addBlog;
const getBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId } = req.params;
    if (!blogId)
        return res.send({ success: false, msg: "Please send blog id." });
    try {
        const blog = yield blog_model_1.default.findById(blogId).exec();
        if (!blog) {
            return res.send({ success: false, msg: "Blog not found" });
        }
        res.send({ success: true, blog });
    }
    catch (error) {
        console.log(error);
        res.send({ success: false, msg: "Failed to get the BLOG" });
    }
});
exports.getBlogById = getBlogById;
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: blogId } = req.body;
    const { title, subtitle, description, featuredImages, metaTitle, metaDescription, metaKeywords, } = req.body;
    try {
        const updatedBlog = yield blog_model_1.default.findByIdAndUpdate(blogId, {
            title,
            subtitle,
            description,
            featuredImages,
            metaTitle,
            metaDescription,
            metaKeywords,
        }, { new: true }).exec();
        if (!updatedBlog) {
            return res.send({ success: false, msg: "Blog not found" });
        }
        res.send({ success: true, msg: "Blog updated!" });
    }
    catch (error) {
        res.send({ success: false, msg: "Failed to update the blog" });
    }
});
exports.updateBlog = updateBlog;
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId } = req.params;
    try {
        const deletedBlog = yield blog_model_1.default.findByIdAndDelete(blogId).exec();
        if (!deletedBlog) {
            return res.send({ success: false, msg: "Blog not found" });
        }
        res.send({ success: true, msg: "Blog deleted!" });
    }
    catch (error) {
        res.send({ success: false, msg: "Failed to delete the blog" });
    }
});
exports.deleteBlog = deleteBlog;
const getBlogs = (req, res) => {
    const { keywords, skip, limit, isPublic } = req.query;
    const qSkip = skip && !(0, lodash_1.isNaN)((0, lodash_1.toNumber)(skip)) ? (0, lodash_1.toNumber)(skip) : 0;
    const qLimit = limit && !(0, lodash_1.isNaN)((0, lodash_1.toNumber)(limit)) ? (0, lodash_1.toNumber)(limit) : 0;
    const query = {};
    if (keywords) {
        const regex = { $regex: keywords, $options: "i" };
        query.$or = [{ title: regex }, { subtitle: regex }];
    }
    if (isPublic)
        query.isArchived = false;
    blog_model_1.default.find(query)
        .sort({ createdAt: -1 })
        .skip(qSkip)
        .limit(qLimit)
        .then((blogs) => __awaiter(void 0, void 0, void 0, function* () {
        const total = yield blog_model_1.default.find(query).countDocuments();
        res.send({ success: true, items: blogs, total });
    }))
        .catch((err) => {
        res.send({ success: false, msg: "Error while fetching blogs!" });
    });
};
exports.getBlogs = getBlogs;
const archiveBlog = (req, res) => {
    const { id, action } = req.body;
    if (!id || !(0, mongoose_1.isValidObjectId)(id))
        return res.send({ success: false, msg: "Please send proper id!" });
    blog_model_1.default.findById(id)
        .then((blog) => {
        if (!blog)
            res.send({ success: false, msg: "Blog not found!" });
        else {
            blog.isArchived = action === "archive";
            blog.save((err, saved) => {
                console.log(err);
                if (err)
                    res.send({ success: false, msg: "Error while updating blog" });
                else
                    res.send({ success: true, msg: "Blog is updated!" });
            });
        }
    })
        .catch((err) => {
        res.send({ success: false, msg: "Error while fetching blog!" });
    });
};
exports.archiveBlog = archiveBlog;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const auth_1 = __importDefault(require("../middlewares/auth"));
const blog_controller_1 = require("./controller/blog.controller");
const blogRouter = (0, express_1.Router)();
// @ts-ignore
blogRouter.use(auth_1.default.required, auth_1.default.isAdmin);
// @ts-ignore
blogRouter
    .route("")
    // @ts-ignore
    .get(blog_controller_1.getBlogs)
    // @ts-ignore
    .post(blog_controller_1.addBlog)
    // @ts-ignore
    .patch(blog_controller_1.updateBlog)
    // @ts-ignore
    .delete(blog_controller_1.deleteBlog);
blogRouter
    .route("/:blogId")
    // @ts-ignore
    .get(blog_controller_1.getBlogById);
blogRouter
    .route("/archive")
    // @ts-ignore
    .post(blog_controller_1.archiveBlog);
module.exports = blogRouter;

import { Router } from "express";
import auth from "../middlewares/auth";
import {
  addBlog,
  archiveBlog,
  deleteBlog,
  getBlogById,
  getBlogs,
  updateBlog,
} from "./controller/blog.controller";

const blogRouter = Router();

// @ts-ignore
blogRouter.use(auth.required, auth.isAdmin);

// @ts-ignore
blogRouter
  .route("")
  // @ts-ignore
  .get(getBlogs)
  // @ts-ignore
  .post(addBlog)
  // @ts-ignore
  .patch(updateBlog)
  // @ts-ignore
  .delete(deleteBlog);

blogRouter
  .route("/:blogId")
  // @ts-ignore
  .get(getBlogById);

blogRouter
  .route("/archive")
  // @ts-ignore
  .post(archiveBlog);

export = blogRouter;

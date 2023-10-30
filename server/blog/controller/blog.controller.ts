import { isNaN, toNumber } from "lodash";
import BlogModel from "../models/blog.model";
import { FilterQuery, isValidObjectId } from "mongoose";
import IBlog from "../types/Blog";

export const addBlog = (req: any, res: any) => {
  const {
    title,
    subtitle,
    description,
    featuredImages,
    metaTitle,
    metaDescription,
    metaKeywords,
  } = req.body;

  if (!title || !subtitle || !description) {
    return res.send({
      success: false,
      msg: "Please send proper parameters!",
    });
  }

  const blog = new BlogModel({
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

export const getBlogById = async (
  req: any,
  res: any
) => {
  const { blogId } = req.params;

  if (!blogId) return res.send({ success: false, msg: "Please send blog id." });

  try {
    const blog = await BlogModel.findById(blogId).exec();

    if (!blog) {
      return res.send({ success: false, msg: "Blog not found" });
    }

    res.send({ success: true, blog });
  } catch (error) {
    console.log(error);
    res.send({ success: false, msg: "Failed to get the BLOG" });
  }
};

export const updateBlog = async (req: any, res: any) => {
  const { id: blogId } = req.body;
  const {
    title,
    subtitle,
    description,
    featuredImages,
    metaTitle,
    metaDescription,
    metaKeywords,
  } = req.body;

  try {
    const updatedBlog = await BlogModel.findByIdAndUpdate(
      blogId,
      {
        title,
        subtitle,
        description,
        featuredImages,
        metaTitle,
        metaDescription,
        metaKeywords,
      },
      { new: true }
    ).exec();

    if (!updatedBlog) {
      return res.send({ success: false, msg: "Blog not found" });
    }

    res.send({ success: true, msg: "Blog updated!" });
  } catch (error) {
    res.send({ success: false, msg: "Failed to update the blog" });
  }
};

export const deleteBlog = async (req: any, res: any) => {
  const { blogId } = req.params;

  try {
    const deletedBlog = await BlogModel.findByIdAndDelete(blogId).exec();

    if (!deletedBlog) {
      return res.send({ success: false, msg: "Blog not found" });
    }

    res.send({ success: true, msg: "Blog deleted!" });
  } catch (error) {
    res.send({ success: false, msg: "Failed to delete the blog" });
  }
};

export const getBlogs = (req: any, res: any) => {
  const { keywords, skip, limit, isPublic } = req.query;

  const qSkip = skip && !isNaN(toNumber(skip)) ? toNumber(skip) : 0;
  const qLimit = limit && !isNaN(toNumber(limit)) ? toNumber(limit) : 0;

  const query: FilterQuery<IBlog> = {};

  if (keywords) {
    const regex = { $regex: keywords, $options: "i" };
    query.$or = [{ title: regex }, { subtitle: regex }];
  }

  if (isPublic) query.isArchived = false;

  BlogModel.find(query)
    .sort({ createdAt: -1 })
    .skip(qSkip)
    .limit(qLimit)
    .then(async (blogs) => {
      const total = await BlogModel.find(query).countDocuments();
      res.send({ success: true, items: blogs, total });
    })
    .catch((err) => {
      res.send({ success: false, msg: "Error while fetching blogs!" });
    });
};

export const archiveBlog = (req: any, res: any) => {
  const { id, action } = req.body;

  if (!id || !isValidObjectId(id))
    return res.send({ success: false, msg: "Please send proper id!" });

  BlogModel.findById(id)
    .then((blog) => {
      if (!blog) res.send({ success: false, msg: "Blog not found!" });
      else {
        blog.isArchived = action === "archive";
        blog.save((err, saved) => {
          console.log(err);
          if (err)
            res.send({ success: false, msg: "Error while updating blog" });
          else res.send({ success: true, msg: "Blog is updated!" });
        });
      }
    })
    .catch((err) => {
      res.send({ success: false, msg: "Error while fetching blog!" });
    });
};

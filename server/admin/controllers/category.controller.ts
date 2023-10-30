import { isNaN, toNumber } from "lodash";
import CategoryModel from "../models/categories.model";

export const addCategory = (req: any, res: any) => {
  const { id } = req.payload;
  const { name, image } = req.body;

  if (!name)
    return res.send({ success: false, msg: "Please send valid parameters!" });

  new CategoryModel({ name, image, createdBy: id }).save((err) => {
    if (err) res.send({ success: false, msg: "Unable to create category!" });
    else res.send({ success: true, msg: "Category created!" });
  });
};

export const getCategories = (req: any, res: any) => {
  const { keywords, skip, limit } = req.query;

  let qSkip = 0;
  let qLimit = 50;
  const query: any = {};
  if (keywords) query.name = keywords;
  if (!req.payload || req.payload.role === "staff") query.isArchived = false;
  if (limit && !isNaN(toNumber(limit))) qLimit = toNumber(limit);
  if (skip && !isNaN(toNumber(skip))) qSkip = toNumber(skip);

  CategoryModel.find(query)
    .populate({ path: "createdBy", select: "displayName role" })
    .skip(qSkip)
    .limit(qLimit)
    .sort({ createdAt: -1 })
    .then(async (categories) => {
      const total = await CategoryModel.find(query).countDocuments();
      res.send({ success: true, categories, total });
    })
    .catch((err) =>
      res.send({ success: false, msg: "Unable to fetch categories!" })
    );
};

export const updateCategory = (req: any, res: any) => {
  const { name, image, id } = req.body;

  if (!name)
    return res.send({ success: false, msg: "Please send valid parameters!" });

  CategoryModel.findById(id)
    .then((category) => {
      if (!category)
        res.send({ success: false, msg: "Category doesn't exist!" });
      else {
        category.name = name;
        category.image = image;
        category.save((err) => {
          if (err) res.send({ success: false, msg: "Unable to update!" });
          else res.send({ success: true, msg: "Category updated!" });
        });
      }
    })
    .catch((err) =>
      res.send({ success: false, msg: "Unable to find category!" })
    );
};

export const archiveCategory = (req: any, res: any) => {
  const { id, action } = req.query;

  CategoryModel.findById(id)
    .then((category) => {
      if (!category)
        res.send({ success: false, msg: "Category doesn't exist!" });
      else {
        category.isArchived = action === "archive";
        category.save((err) => {
          if (err) res.send({ success: false, msg: "Unable to update!" });
          else res.send({ success: true, msg: "Category archived!" });
        });
      }
    })
    .catch((err) =>
      res.send({ success: false, msg: "Unable to find category!" })
    );
};

import { isNaN, toNumber } from "lodash";
import { isValidObjectId } from "mongoose";
import SubCategoryModel from "../models/subcategories.model";

export const addSubcategory = (req: any, res: any) => {
  const { category, name, image } = req.body;
  const { id } = req.payload;

  if (!category || !name)
    return res.send({ success: false, msg: "Please send proper parameters!" });

  new SubCategoryModel({ category, name, image, createdBy: id }).save((err) => {
    if (err)
      res.send({ success: false, msg: "Error while adding Sub Category!" });
    else res.send({ success: true, msg: "Sub category" });
  });
};

export const getSubcategory = (req: any, res: any) => {
  const { keywords, skip, limit } = req.query;

  let qSkip = 0;
  let qLimit = 50;
  const query: any = {};
  const populateQuery: any = {};
  if (keywords) {
    query.name = { $regex: keywords, $options: "i" };
    populateQuery.name = { $regex: keywords, $options: "i" };
    if (isValidObjectId(keywords)) populateQuery._id = keywords;
  }
  if (!req.payload || req.payload.role === "staff") query.isArchived = false;
  if (limit && !isNaN(toNumber(limit))) qLimit = toNumber(limit);
  if (skip && !isNaN(toNumber(skip))) qSkip = toNumber(skip);

  SubCategoryModel.find(query)
    .skip(qSkip)
    .limit(qLimit)
    .sort({ createdAt: -1 })
    .populate([
      { path: "category", match: query },
      { path: "createdBy", select: "displayName role" },
    ])
    .then(async (subcategories) => {
      const total = await SubCategoryModel.find(query).countDocuments();
      res.send({ success: true, subcategories, total });
    })
    .catch((err) =>
      res.send({ success: false, msg: "Unable to fetch Sub Categories!" })
    );
};

export const updateSubcategory = (
  req: any,
  res: any
) => {
  const { category, name, image, id } = req.body;

  SubCategoryModel.findById(id)
    .then((sub) => {
      if (!sub) res.send({ success: false, msg: "Sub Category not found!" });
      else {
        sub.category = category;
        sub.name = name;
        sub.image = image;
        sub.save((err) => {
          if (err)
            res.send({
              success: false,
              msg: "Error while updating Sub Category!",
            });
          else res.send({ success: true, msg: "Sub Category updated!" });
        });
      }
    })
    .catch((err) =>
      res.send({ success: false, msg: "Error while getting Sub Category!" })
    );
};

export const archiveSubCategory = (
  req: any,
  res: any
) => {
  const { id, action } = req.query;

  SubCategoryModel.findById(id)
    .then((sub) => {
      if (!sub)
        res.send({ success: false, msg: "Sub Category doesn't exist!" });
      else {
        sub.isArchived = action === "archive";
        sub.save((err) => {
          if (err) res.send({ success: false, msg: "Unable to update!" });
          else res.send({ success: true, msg: "Sub Category archived!" });
        });
      }
    })
    .catch((err) => res.send({ success: false, msg: "Unable to find scent!" }));
};

import { isNaN, toNumber } from "lodash";
import BrandModel from "../models/brand.model";

export const addBrand = (req: any, res: any) => {
  const { id } = req.payload;
  const { name, logo } = req.body;

  if (!name)
    return res.send({ success: false, msg: "Please send valid parameters!" });

  new BrandModel({ name, logo, createdBy: id }).save((err) => {
    if (err) res.send({ success: false, msg: "Unable to create brand!" });
    else res.send({ success: true, msg: "Brand created!" });
  });
};

export const getBrands = (req: any, res: any) => {
  const { keywords, skip, limit } = req.query;

  let qSkip = 0;
  let qLimit = 50;
  const query: any = {};
  if (keywords) query.name = keywords;
  if (!req.payload || req.payload.role === "staff") query.isArchived = false;
  if (limit && !isNaN(toNumber(limit))) qLimit = toNumber(limit);
  if (skip && !isNaN(toNumber(skip))) qSkip = toNumber(skip);

  BrandModel.find(query)
    .populate({ path: "createdBy", select: "displayName role" })
    .skip(qSkip)
    .limit(qLimit)
    .sort({ createdAt: -1 })
    .then(async (brands) => {
      const total = await BrandModel.find(query).countDocuments();
      res.send({ success: true, brands, total });
    })
    .catch((err) =>
      res.send({ success: false, msg: "Unable to fetch brands!" })
    );
};

export const updateBrand = (req: any, res: any) => {
  const { name, logo, id } = req.body;

  if (!name)
    return res.send({ success: false, msg: "Please send valid parameters!" });

  BrandModel.findById(id)
    .then((brand) => {
      if (!brand) res.send({ success: false, msg: "Brand doesn't exist!" });
      else {
        brand.name = name;
        brand.logo = logo;
        brand.save((err) => {
          if (err) res.send({ success: false, msg: "Unable to update!" });
          else res.send({ success: true, msg: "Brand updated!" });
        });
      }
    })
    .catch((err) => res.send({ success: false, msg: "Unable to find brand!" }));
};

export const archiveBrand = (req: any, res: any) => {
  const { id, action } = req.query;

  BrandModel.findById(id)
    .then((brand) => {
      if (!brand) res.send({ success: false, msg: "Brand doesn't exist!" });
      else {
        brand.isArchived = action === "archive";
        brand.save((err) => {
          if (err) res.send({ success: false, msg: "Unable to update!" });
          else res.send({ success: true, msg: "Brand archived!" });
        });
      }
    })
    .catch((err) => res.send({ success: false, msg: "Unable to find brand!" }));
};

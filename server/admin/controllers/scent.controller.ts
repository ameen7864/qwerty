import { isNaN, toNumber } from "lodash";
import ScentModel from "../models/scent.model";

export const addScent = (req: any, res: any) => {
  const { id } = req.payload;
  const { name, color } = req.body;

  if (!name)
    return res.send({ success: false, msg: "Please send valid parameters!" });

  new ScentModel({ name, color, createdBy: id }).save((err) => {
    if (err) res.send({ success: false, msg: "Unable to create scent!" });
    else res.send({ success: true, msg: "Scent created!" });
  });
};

export const getScents = (req: any, res: any) => {
  const { keywords, skip, limit } = req.query;

  let qSkip = 0;
  let qLimit = 50;
  const query: any = {};
  if (keywords) query.name = keywords;
  if (!req.payload || req.payload.role === "staff") query.isArchived = false;
  if (limit && !isNaN(toNumber(limit))) qLimit = toNumber(limit);
  if (skip && !isNaN(toNumber(skip))) qSkip = toNumber(skip);

  ScentModel.find(query)
    .populate({ path: "createdBy", select: "displayName role" })
    .skip(qSkip)
    .limit(qLimit)
    .sort({ createdAt: -1 })
    .then(async (scents) => {
      const total = await ScentModel.find(query).countDocuments();
      res.send({ success: true, scents, total });
    })
    .catch((err) =>
      res.send({ success: false, msg: "Unable to fetch scents!" })
    );
};

export const updateScent = (req: any, res: any) => {
  const { name, color, id } = req.body;

  if (!name)
    return res.send({ success: false, msg: "Please send valid parameters!" });

  ScentModel.findById(id)
    .then((scent) => {
      if (!scent) res.send({ success: false, msg: "Scent doesn't exist!" });
      else {
        scent.name = name;
        scent.color = color;
        scent.save((err) => {
          if (err) res.send({ success: false, msg: "Unable to update!" });
          else res.send({ success: true, msg: "Scent updated!" });
        });
      }
    })
    .catch((err) => res.send({ success: false, msg: "Unable to find scent!" }));
};

export const archiveScent = (req: any, res: any) => {
  const { id, action } = req.query;

  ScentModel.findById(id)
    .then((scent) => {
      if (!scent) res.send({ success: false, msg: "Scent doesn't exist!" });
      else {
        scent.isArchived = action === "archive";
        scent.save((err) => {
          if (err) res.send({ success: false, msg: "Unable to update!" });
          else res.send({ success: true, msg: "Scent archived!" });
        });
      }
    })
    .catch((err) => res.send({ success: false, msg: "Unable to find scent!" }));
};

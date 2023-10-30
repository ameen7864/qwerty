import {
  assign,
  forEach,
  isNaN,
  random,
  split,
  toNumber,
  toString,
} from "lodash";
import { isValidObjectId } from "mongoose";
import ProductModel from "../models/product.model";
import ProductGroupModel from "../models/productGroups.model";
import { isAdmin } from "../../utils/auth";
import ProductTransactionModel from "../models/producttransactions.model";
import PricesModel from "../models/prices.model";
import IProduct from "../types/Product";
import RandomProductGenerationModel from "../models/randomproductgeneration.model";

export const addGroup = (req: any, res: any) => {
  const { id } = req.payload;
  const { name } = req.body;

  new ProductGroupModel({ name, createdBy: id }).save((err) => {
    if (err) res.send({ success: false, msg: "Error while adding!" });
    else res.send({ success: true, msg: "Group added!" });
  });
};

export const getGroups = (req: any, res: any) => {
  const { role } = req.payload;
  const { keywords, skip, limit } = req.query;
  const query: any = {};

  let qSkip = 0;
  let qLimit = 50;

  if (role !== "admin") query.isArchived = false;

  if (skip && !isNaN(toNumber(skip))) qSkip = toNumber(skip);
  if (limit && !isNaN(toNumber(limit))) qLimit = toNumber(limit);

  if (keywords) {
    const regex = { $regex: keywords, $options: "i" };
    query.$or = [];
    query.$or.push({ name: regex });
    if (isValidObjectId(keywords)) query.$or.push({ _id: keywords });
  }

  ProductGroupModel.find(query)
    .populate([
      { path: "products", select: "name" },
      { path: "createdBy", select: "displayName role" },
    ])
    .skip(qSkip)
    .limit(qLimit)
    .sort({ createdAt: -1 })
    .then(async (groups) => {
      const total = await ProductGroupModel.find(query).countDocuments();
      res.send({ success: true, groups, total });
    })
    .catch((err) => {
      res.send({ success: false, msg: "Error while loading groups!" });
    });
};

export const getGroupOnlyNames = (
  req: any,
  res: any
) => {
  ProductGroupModel.find({})
    .select("name")
    .sort({ createdAt: -1 })
    .then((groups) => res.send({ success: true, groups }))
    .catch((err) =>
      res.send({ success: false, msg: "Error while loading groups!" })
    );
};

export const addProduct = async (req: any, res: any) => {
  const { id } = req.payload;
  const {
    name,
    description,
    image,
    otherImages,
    brand,
    subcategory,
    category,
    scent,
    price,
    weight,
    newArrival,
    bestseller,
    group,
    quantity,
    sticks,
  } = req.body;

  if (
    !name ||
    !image ||
    !brand ||
    !subcategory ||
    !category ||
    !scent ||
    !price ||
    (!weight && !sticks) ||
    newArrival === undefined ||
    bestseller === undefined
  ) {
    return res.send({ success: false, msg: "Please send proper parameters!" });
  }

  new ProductModel({
    name,
    description,
    mainImage: image,
    otherImages,
    brand,
    subcategory,
    category,
    scent,
    price,
    weight,
    newArrival,
    bestseller,
    group,
    quantity,
    createdBy: id,
    randomIndex: await generateRandomId(),
  }).save((err, saved) => {
    if (err) {
      console.log(err);
      res.send({ success: false, msg: "Error while saving data!" });
    } else {
      if (group) {
        ProductGroupModel.findById(group)
          .then((group) => {
            if (!group) res.send({ success: false, msg: "Group not found!" });
            else {
              group.products.push(saved._id);
              group.save((err) => {
                if (err)
                  res.send({
                    success: false,
                    msg: "Error on adding to group!",
                  });
                else res.send({ success: true, msg: "Product saved!" });
              });
            }
          })
          .catch((err) => {
            res.send({ success: false, msg: "Error while fetching group!" });
          });
      } else res.send({ success: true, msg: "Product saved!" });
    }
  });
};

export const getProducts = (req: any, res: any) => {
  const { keywords, skip, limit, brands, subcategories, scents } = req.query;
  const query: any = {};
  let qSkip = 0;
  let qLimit = 50;

  if (keywords) {
    query.$or = [];
    const regex = { $regex: keywords, $options: "i" };
    query.$or.push({ name: regex });
    if (isValidObjectId(keywords)) query.$or.push({ _id: keywords });
  }

  if (!req.payload || !isAdmin(req.payload.role))
    query.isArchived = { $ne: true };

  if (brands) query.brand = { $in: split(toString(brands), ",") };

  if (subcategories)
    query.subcategory = { $in: split(toString(subcategories), ",") };

  if (scents) query.scent = { $in: split(toString(scents), ",") };

  if (skip && !isNaN(toNumber(skip))) qSkip = toNumber(skip);

  if (limit && !isNaN(toNumber(limit))) qLimit = toNumber(limit);

  ProductModel.find(query)
    .skip(qSkip)
    .limit(qLimit)
    .populate([
      { path: "createdBy", select: "displayName role" },
      { path: "subcategory", select: "name" },
      { path: "category", select: "name" },
      { path: "brand", select: "name" },
      { path: "scent", select: "name" },
    ])
    .sort({ createdAt: -1 })
    .then(async (products) => {
      const total = await ProductModel.find(query).countDocuments();
      res.send({ success: true, products, total });
    })
    .catch((err) => {
      res.send({ success: false, msg: "Error while loading products!", err });
    });
};

export const addQuantity = (req: any, res: any) => {
  const { id: payloadId } = req.payload;
  const { id, quantity: bodyQuantity } = req.body;

  if (!id || !bodyQuantity || isNaN(toNumber(bodyQuantity)))
    return res.send({ success: false, msg: "Please send proper paramteres!" });

  const quantity = toNumber(bodyQuantity);

  ProductModel.findById(id)
    .select("quantity")
    .then((pro) => {
      if (pro) {
        new ProductTransactionModel({
          product: id,
          user: payloadId,
          entryType: "credit",
          quantity,
          closing: quantity + pro.quantity,
        }).save((err) => {
          if (err) {
            res.send({
              success: false,
              msg: "Error while saving transaction!",
            });
          } else {
            pro.quantity = quantity + pro.quantity;
            pro.save((err) => {
              if (err) {
                res.send({
                  success: false,
                  msg: "Error while updating on product, transaction saved!",
                });
              } else {
                res.send({ success: true, msg: "Transaction saved!" });
              }
            });
          }
        });
      } else res.send({ success: false, msg: "Product not found!" });
    })
    .catch((err) =>
      res.send({ success: false, msg: "Error while loading product!" })
    );
};

export const archiveProduct = (req: any, res: any) => {
  const { id, action } = req.query;

  if (!id) return res.send({ success: false, msg: "Id is not sent!" });

  ProductModel.findOne({ _id: id })
    .then((pro) => {
      if (!pro) {
        res.send({ success: false, msg: "Product not found!" });
      } else {
        pro.isArchived = action === "archive";
        pro.save((err) => {
          if (err)
            res.send({ success: false, msg: "Error while updating status!" });
          else res.send({ success: true, msg: "Product updated!" });
        });
      }
    })
    .catch((err) => {
      res.send({ success: false, msg: "Error while loading product!" });
    });
};

export const updateByKey = (req: any, res: any) => {
  const { id, key, value } = req.body;

  const blankFields = ["weight", "sticks", "currentDiscount"];

  if (!id || (!blankFields.includes(key) && !value))
    return res.send({ success: false, msg: "Please send proper parameters!" });

  ProductModel.findById(id)
    .then(async (pro) => {
      if (!pro) res.send({ success: false, msg: "Product not found!" });
      else {
        // @ts-ignore
        pro[key] = value;
        if (!pro.randomIndex) {
          pro.randomIndex = await generateRandomId();
        }
        if (key === "currentDiscount") {
          pro.discountAmount = pro.price * (value / 100);
        }
        pro.save((err) => {
          if (err) {
            console.log(err);
            res.send({ success: false, msg: "Error while updating!" });
          } else res.send({ success: true, msg: "Product updated!" });
        });
      }
    })
    .catch((err) =>
      res.send({ success: false, msg: "Error while loading product!" })
    );
};

export const updatePrice = (req: any, res: any) => {
  const { id } = req.payload;
  const { price, product } = req.body;

  if (!price || !product)
    return res.send({ success: false, msg: "Please send proper parameters!" });

  ProductModel.findById(product)
    .then(async (pro) => {
      if (pro) {
        await new PricesModel({
          changedBy: id,
          changedOn: new Date(),
          price,
          product,
        }).save();
        pro.price = price;
        if (!pro.randomIndex) {
          pro.randomIndex = await generateRandomId();
        }
        pro.save((err) => {
          if (err)
            res.send({ success: false, msg: "Error while updating product!" });
          else res.send({ success: true, msg: "Price updated!" });
        });
      } else res.send({ success: false, msg: "Product not found!" });
    })
    .catch((err) => {
      res.send({ success: false, msg: "Error while getting product!" });
    });
};

export const getSingleProduct = (req: any, res: any) => {
  const { id } = req.query;

  if (!id) return res.send({ success: false, msg: "Id is not sent!" });

  ProductModel.findById(id)
    .populate([
      { path: "brand", select: "name" },
      { path: "scent", select: "name" },
      { path: "category", select: "name" },
      { path: "subcategory", select: "name" },
      { path: "relatedProducts" },
    ])
    .then((pro) => {
      if (!pro) res.send({ success: false, msg: "Product not found!" });
      else res.send({ success: true, product: pro });
    });
};

export const updateDescription = (
  req: any,
  res: any
) => {
  const { id, description } = req.body;

  if (!id || !isValidObjectId(id) || !description)
    return res.send({ success: false, msg: "Please send proper parameters!" });

  ProductModel.findById(id)
    .then(async (pro) => {
      if (!pro) res.send({ success: false, msg: "Product not found!" });
      else {
        pro.description = description;
        if (!pro.randomIndex) {
          pro.randomIndex = await generateRandomId();
        }
        pro.save((err) => {
          if (err)
            res.send({
              success: false,
              msg: "Error while updating product!",
            });
          else res.send({ success: true, msg: "Images updated!" });
        });
      }
    })
    .catch((err) =>
      res.send({ success: false, msg: "Error while fetching product!" })
    );
};

export const updateImages = (req: any, res: any) => {
  const { id, mainImage, otherImages } = req.body;

  if (!id || !isValidObjectId(id) || !mainImage)
    return res.send({ success: false, msg: "Please send proper parameters!" });

  ProductModel.findById(id)
    .then(async (pro) => {
      if (!pro) res.send({ success: false, msg: "Product not found!" });
      else {
        pro.mainImage = mainImage;
        pro.otherImages = otherImages;
        if (!pro.randomIndex) {
          pro.randomIndex = await generateRandomId();
        }
        pro.save((err) => {
          if (err)
            res.send({ success: false, msg: "Error while updating product!" });
          else res.send({ success: true, msg: "Images updated!" });
        });
      }
    })
    .catch((err) =>
      res.send({ success: false, msg: "Error while fetching product!" })
    );
};

const generateRandomId = async () => {
  let rand = random(1, 10000000, false);
  let generated = false;

  while (!generated) {
    const pro = await ProductModel.findOne({ randomIndex: rand });
    if (!pro) generated = true;
    else rand = random(1, 10000000, false);
  }

  return rand;
};

const updateProductRandom = async (product: IProduct) => {
  product.randomIndex = await generateRandomId();
  await product.save().then();
};

export const generateRandomIndices = async (
  req: any,
  res: any
) => {
  try {
    const { id } = req.payload;

    RandomProductGenerationModel.create({ user: id });

    const products = await ProductModel.find({});

    for (let i = 0; i < products.length; i++) {
      await updateProductRandom(products[i]);
    }
  } catch (err) {
    res.send({
      success: false,
      msg: "Error while processing your request",
      err,
    });
  }
};

export const addItemToRelatedProducts = (
  req: any,
  res: any
) => {
  const { id, product: idToAdd } = req.body;

  ProductModel.findById(id)
    .then((pro) => {
      if (!pro) res.send({ success: false, msg: "Product not found!" });
      else {
        let proExist = false;
        forEach(pro.relatedProducts, (pros) => {
          if (toString(pros) === toString(idToAdd)) proExist = true;
        });
        if (!proExist) pro.relatedProducts.push(idToAdd);
        pro.save(async (err) => {
          if (err)
            res.send({ success: false, msg: "Error while saving product!" });
          else {
            ProductModel.findById(idToAdd)
              .then((pr) => {
                if (!pr)
                  res.send({
                    success: false,
                    msg: "Error while updating product",
                  });
                else {
                  let proExist = false;
                  forEach(pr.relatedProducts, (pros) => {
                    if (toString(pros) === toString(id)) proExist = true;
                  });
                  if (!proExist) pr.relatedProducts.push(id);
                  pr.save((err) => {
                    if (err) {
                      res.send({ success: false, msg: "Product not updated!" });
                    } else {
                      res.send({ success: true, msg: "Product Updated!" });
                    }
                  });
                }
              })
              .catch((err) =>
                res.send({
                  success: false,
                  msg: "Error while getting Product!",
                })
              );
          }
        });
      }
    })
    .catch((err) =>
      res.send({ success: false, msg: "Error while finding products!" })
    );
};

export const getRelatedProducts = (
  req: any,
  res: any
) => {
  const { id } = req.query;

  if (!id) return res.send({ success: false, msg: "Product id not sent!" });

  ProductModel.findById(id)
    .populate("relatedProducts")
    .then((pro) => {
      if (!pro) res.send({ success: false, msg: "Product not found!" });
      else res.send({ success: true, relatedProducts: pro.relatedProducts });
    })
    .catch((err) =>
      res.send({ success: false, msg: "Error while fetching product!" })
    );
};

import _, { toString } from "lodash";
import CartModel from "./cart.model";
import { verifyJWT } from "../utils/jwt";
import { getTokenFromReq } from "../utils/auth";

export const add = (req: any, res: any) => {
  const { user, device, product, quantity } = req.body;

  if ((!user && !device) || !product || !quantity)
    return res.send({ success: false, msg: "Please enter valid parameters!" });

  const query: any = {};
  if (user) query.user = user;
  else query.device = device;
  query.isArchived = false;
  query.product = product;

  CartModel.findOne(query)
    .then((cart) => {
      if (!cart) {
        new CartModel({ user, device, product, quantity }).save((err) => {
          if (err) res.send({ success: false, msg: "Error while adding!" });
          else {
            req.query.user = user;
            req.query.device = device;
            get(req, res);
          }
        });
      } else {
        cart.quantity += quantity;
        cart.save((err) => {
          if (err) res.send({ success: false, msg: "Error while adding!" });
          else {
            req.query.user = user;
            req.query.device = device;
            get(req, res);
          }
        });
      }
    })
    .catch((Err) =>
      res.send({ success: false, msg: "Error while adding to cart!" })
    );
};

export const get = (req: any, res: any) => {
  const { device, user } = req.query;

  const query: any = {};
  if (device) query.device = device;
  if (user) {
    const token = getTokenFromReq(req);
    if (token) {
      const payload = verifyJWT(token);
      if (payload && _.get(payload, "id")) {
        if (_.get(payload, "role") === "user")
          query.user = _.get(payload, "id");
        else query.user = user;
      }
    } else {
      return res.send({ success: false, msg: "Authentication is required!" });
    }
  }
  query.isArchived = false;

  CartModel.find(query)
    .populate([
      {
        path: "product",
        select: "name brand price mainImage discountAmount currentDiscount",
        populate: { path: "brand", select: "name" },
      },
    ])
    .then((items) => res.send({ success: true, items }))
    .catch((err) => {
      res.send({ success: false, msg: "Error while loading cart!" });
    });
};

export const remove = (req: any, res: any) => {
  const { id } = req.query;

  CartModel.findById(id)
    .then((cart) => {
      if (!cart) res.send({ success: false, msg: "Item not found!" });
      else {
        cart.isArchived = true;
        cart.save((err) => {
          if (err) res.send({ success: false, msg: "Item not removed!" });
          else {
            req.query.user = toString(cart.user);
            req.query.device = toString(cart.device);
            get(req, res);
          }
        });
      }
    })
    .catch((err) => {
      res.send({ success: false, msg: "Error while removing item!" });
    });
};

export const removeAll = (req: any, res: any) => {
  const { device, user } = req.query;

  if (!device && !user)
    return res.send({ success: false, msg: "Please send proper parameters!" });

  const query: any = {};
  if (device) query.device = device;
  if (user) query.user = user;
  query.isArchived = false;

  CartModel.updateMany(query, { $set: { isArchived: true } })
    .then((cart) => {
      res.send({ success: true, msg: "All items removed!" });
    })
    .catch((err) => {
      res.send({ success: false, msg: "Error while removing items!" });
    });
};

export const updateQuantity = (req: any, res: any) => {
  const { _id, quantity } = req.body;

  if (!_id || !quantity)
    return res.send({ success: false, msg: "Please send proper parameters!" });

  CartModel.findById(_id)
    .then((cart) => {
      if (!cart) res.send({ success: false, msg: "Cart not found!" });
      else {
        cart.quantity = quantity;
        cart.save((err) => {
          if (err) res.send({ success: false, msg: "Quantity not updated!" });
          else res.send({ success: true, msg: "Quantity updated!" });
        });
      }
    })
    .catch((err) => {
      res.send({ success: false, msg: "Error while getting cart!" });
    });
};
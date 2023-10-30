import { toString } from "lodash";
import WishlistModel from "./wishlist.model";

export const add = (req: any, res: any) => {
  const { product, device, user } = req.body;

  if (!product || (!device && !user))
    return res.send({ success: false, msg: "Please send proper parameters!" });

  new WishlistModel({ product, device, user }).save((err) => {
    if (err) res.send({ success: false, msg: "Error while adding!" });
    else {
      req.query.device = device;
      req.query.user = user;
      get(req, res);
    }
  });
};

export const get = (req: any, res: any) => {
  const { device, user } = req.query;

  const query: any = {};
  if (device) query.device = device;
  if (user) query.user = user;
  query.isArchived = false;

  WishlistModel.find(query)
    .populate({
      path: "product",
      select: "name brand mainImage price discountAmount currentDiscount",
      populate: [{ path: "brand", select: "name" }],
    })
    .then((items) => {
      res.send({ success: true, items });
    })
    .catch((err) =>
      res.send({ success: false, msg: "Error while loading wishlist!" })
    );
};

export const remove = (req: any, res: any) => {
  const { id } = req.query;

  WishlistModel.findById(id).then((wish) => {
    if (wish) {
      wish.isArchived = true;
      wish.save((err) => {
        if (err)
          res.send({ success: false, msg: "Error while removing item!" });
        else {
          req.query.user = toString(wish.user);
          req.query.device = toString(wish.device);
          get(req, res);
        }
      });
    } else res.send({ success: false, msg: "Item not found!" });
  });
};

export const removeAll = (req: any, res: any) => {
  const { user, device } = req.query;

  if (!user && !device)
    return res.send({ success: false, msg: "Please send proper parameters!" });

  const query: any = {};
  if (user) query.user = user;
  if (device) query.device = device;
  query.isArchived = false;

  WishlistModel.updateMany(query, {
    $set: { isArchived: true },
  })
    .then((updated) => res.send({ success: true, msg: "Items Removed!" }))
    .catch(() => res.send({ success: false, msg: "Error while removing!" }));
};

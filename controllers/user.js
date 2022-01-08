const User = require("../models/user");
const { Order } = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "No user found in the DB",
      });
    }

    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  // TODO: get back here for password
  // req.profile me humne Sbkuch show o rha hai, we don't want that, so we are hiding the information
  // We are setting UNDEFINED in the profile not in the DB
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.updatedAt = undefined;
  req.profile.createdAt = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },

    (err, user) => {
      if (err) {
        return res.status(400).json({
          err: "You are NOT AUTHORIZED to update the user Information",
        });
      }

      user.salt = undefined;
      user.encry_password = undefined;
      user.updatedAt = undefined;
      user.createdAt = undefined;
      res.json(user);
    }
  );
};

console.log(Order);
exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          err: "NO OrderList Found in the user",
        });
      }

      return res.json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];

  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  //   Store the Product information in the DATABASE

  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true },

    (err, purchases) => {
      if (err) {
        return res.json({
          err: "Unable to save the Product in The DB",
        });
      }
      next();
    }
  );
};

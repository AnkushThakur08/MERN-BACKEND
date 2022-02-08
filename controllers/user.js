const User = require("../models/user");
const { Order } = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: "No user found in the DB",
      });
    }

    req.profile = user;
    // console.log(req.profile);
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

    (error, user) => {
      if (error) {
        return res.status(400).json({
          error: "You are NOT AUTHORIZED to update the user Information",
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

// console.log(Order);
exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((error, order) => {
      if (error) {
        return res.status(400).json({
          error: "NO OrderList Found in the user",
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

    (error, purchases) => {
      if (error) {
        return res.json({
          error: "Unable to save the Product in The DB",
        });
      }
      next();
    }
  );
};

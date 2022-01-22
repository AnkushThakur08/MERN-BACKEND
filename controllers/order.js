const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          err: "No order Found in DB",
        });
      }

      req.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;

  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        err: "Failed to save Order in the DB",
      });
    }

    res.json(order);
  });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, orders) => {
      if (err || !orders) {
        return res.status(400).json({
          err: "NO Order Found in the DB",
        });
      }

      res.json(orders);
    });
};

exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
  Order.findOneAndUpdate(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, orderStatus) => {
      if (err) {
        return res.status(400).json({
          err: "Failed to Update the Status in the DB",
        });
      }

      res.json(orderStatus);
    }
  );
};

const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((error, order) => {
      if (error) {
        return res.status(400).json({
          error: "No order Found in DB",
        });
      }

      req.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;

  const order = new Order(req.body.order);
  order.save((error, order) => {
    if (error) {
      console.log(error);
      return res.status(400).json({
        error: "Failed to save Order in the DB",
      });
    }

    res.json(order);
  });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((error, orders) => {
      if (error || !orders) {
        return res.status(400).json({
          error: "NO Order Found in the DB",
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
    (error, orderStatus) => {
      if (error) {
        return res.status(400).json({
          error: "Failed to Update the Status in the DB",
        });
      }

      res.json(orderStatus);
    }
  );
};

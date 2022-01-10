const Product = require("../models/products");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          err: "Unable to Fetch the Product from the DB",
        });
      }

      req.product = product;
      next();
    });
};

exports.getProduct = (req, res) => {
  return res.json(req.product);
};

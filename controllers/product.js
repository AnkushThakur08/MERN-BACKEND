const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

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

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        err: "Problem with Image or FILE",
      });
    }

    // Destructure of Fields
    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        err: "All Fields are required",
      });
    }

    let product = new Product(fields);

    if (file.photo) {
      if (file.photo.size > 4000000) {
        return res.status(400).json({
          err: "Image Limit is 3 MB",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.filepath);
      product.photo.contentType = file.photo.mimetype;
    }

    console.log(product);

    // Save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Saving t-shirt in DB Failed",
        });
      }

      res.json(product);
    });
  });
};

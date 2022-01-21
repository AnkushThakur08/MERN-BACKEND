const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash"); /* Private Variable */
const fs = require("fs");

// Parametes
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

// create Controllers
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

    // console.log(product);

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

// Read Controllers
exports.getProduct = (req, res) => {
  req.product.photo = undefined;

  return res.json(req.product);
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

// Delete Controllers
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        err: "Unable to delete the product",
      });
    }

    res.json({
      message: "Deleted Successfully",
      deletedProduct,
    });
  });
};

// Update Controller
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        err: "Problem with Image or FILE",
      });
    }

    // UPDATION CODE
    let product = req.product;
    product = _.extend(product, fields);
    // extend method, takes the existing  value and Update it take the value from the product (i.e DB) & update it with the fields

    if (file.photo) {
      if (file.photo.size > 4000000) {
        return res.status(400).json({
          err: "Image Limit is 3 MB",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.filepath);
      product.photo.contentType = file.photo.mimetype;
    }

    // Save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Updation of Product Failed",
        });
      }

      res.json(product);
    });
  });
};

// Product Listing
exports.getAllProduct = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err || !products) {
        return res.status(400).json({
          err: "No Product Found in DB",
        });
      }

      res.json(products);
    });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        err: "Bulk Operation Failed",
      });
    }

    next();
  });
};

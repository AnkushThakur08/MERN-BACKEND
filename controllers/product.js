const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash"); /* Private Variable */
const fs = require("fs");

// Parametes
exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((error, product) => {
      if (error || !product) {
        return res.status(400).json({
          error: "Unable to Fetch the Product from the DB",
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

  form.parse(req, (error, fields, file) => {
    if (error) {
      return res.status(400).json({
        error: "Problem with Image or FILE",
      });
    }

    // Destructure of Fields
    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "All Fields are required",
      });
    }

    let product = new Product(fields);

    if (file.photo) {
      if (file.photo.size > 4000000) {
        return res.status(400).json({
          error: "Image Limit is 3 MB",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.filepath);
      product.photo.contentType = file.photo.mimetype;
    }

    // console.log(product);

    // Save to the DB
    product.save((error, product) => {
      if (error) {
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
  product.remove((error, deletedProduct) => {
    if (error) {
      return res.status(400).json({
        error: "Unable to delete the product",
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

  form.parse(req, (error, fields, file) => {
    if (error) {
      return res.status(400).json({
        error: "Problem with Image or FILE",
      });
    }

    // UPDATION CODE
    let product = req.product;
    product = _.extend(product, fields);
    // extend method, takes the existing  value and Update it take the value from the product (i.e DB) & update it with the fields

    if (file.photo) {
      if (file.photo.size > 4000000) {
        return res.status(400).json({
          error: "Image Limit is 3 MB",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.filepath);
      product.photo.contentType = file.photo.mimetype;
    }

    // Save to the DB
    product.save((error, product) => {
      if (error) {
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
    .exec((error, products) => {
      if (error || !products) {
        return res.status(400).json({
          error: "No Product Found in DB",
        });
      }

      res.json(products);
    });
};

exports.getAllUniqueCategory = (req, res) => {
  Product.distinct("category", {}, (error, category) => {
    if (error || !category) {
      return res.status(400).json({
        error: "NO Category Found",
      });
    }

    res.json(category);
  });
};

// Stock Managment
exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (error, products) => {
    if (error) {
      return res.status(400).json({
        error: "Bulk Operation Failed",
      });
    }

    next();
  });
};

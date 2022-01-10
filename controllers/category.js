const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err || !cate) {
      return res.status(400).json({
        err: "No Category found in the DB",
      });
    }

    req.category = cate;
    next();
  });
};

exports.createCategory = (req, res) => {
  console.log(req.body);
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        err: "Unable to create a category in the DB",
      });
    }

    console.log(category);
    return res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    console.log("ANKUSH");
    console.log(categories);
    // console.log(err);
    if (err) {
      return res.status(400).json({
        err: "No Category Found in The DB",
      });
    }

    return res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  console.log(`THIS is ${req.category}`);
  const category = req.category;
  // we are getting this from middleware req.category

  console.log(`THIS is ${req.body.name}`);
  category.name = req.body.name;
  // Front end se jo name aaega..usko category.name me save kr dege

  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        err: "Unable to update the Category in the DB",
      });
    }

    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;

  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        err: "Unable to Delete the Category from the DB",
      });
    }

    res.json({
      message: `${category.name} Category successfully Deleted `,
    });
  });
};

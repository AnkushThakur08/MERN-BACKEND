const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((error, cate) => {
    if (error || !cate) {
      return res.status(400).json({
        error: "No Category found in the DB",
      });
    }

    req.category = cate;
    next();
  });
};

exports.createCategory = (req, res) => {
  console.log(req.body);
  const category = new Category(req.body);
  category.save((error, category) => {
    if (error) {
      return res.status(400).json({
        error: "Unable to create a category in the Database",
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
  Category.find().exec((error, categories) => {
    console.log("ANKUSH");
    console.log(categories);
    // console.log(error);
    if (error) {
      return res.status(400).json({
        error: "No Category Found in The DB",
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

  category.save((error, updatedCategory) => {
    if (error) {
      return res.status(400).json({
        error: "Unable to update the Category in the DB",
      });
    }

    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;

  category.remove((error, category) => {
    if (error) {
      return res.status(400).json({
        error: "Unable to Delete the Category from the DB",
      });
    }

    res.json({
      message: `${category.name} Category successfully Deleted `,
    });
  });
};

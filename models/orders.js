const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productCartSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    ref: "Product",
  },

  name: String,
  quantity: Number,
  price: Number,
});

const productCartSchema = mongoose.model("ProductCart", productCartSchema);

const orderSchema = new mongoose.Schema(
  {
    products: [productCartSchema],
    transaction_Id: {},
    amount: {
      type: Number,
    },
    address: String,
    updated: Date,
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const orderSchema = mongoose.model("Order", orderSchema);

module.exports = { Order, ProductCart };

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: "string",
      trim: true,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);

const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 32,
      trim: true,
    },

    lastName: {
      type: String,
      maxLength: 32,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    userInfo: {
      type: String,
      trim: true,
    },

    encry_password: {
      type: String,
      required: true,
    },

    salt: {
      type: String,
    },

    role: {
      type: Number,
      default: 0,
    },

    purchases: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password; //_ vala Private variable
    // console.log(password);
    this.salt = uuidv4();
    this.encry_password = this.securePassword(password);
    // console.log(this.securePassword(password));
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  autheticate: function (plainPassword) {
    return this.securePassword(plainPassword) === this.encry_password;
  },

  securePassword: function (plainPassword) {
    if (!plainPassword) return "";

    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);

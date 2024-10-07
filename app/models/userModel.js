import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please fill your name"],
    },
    email: {
      type: String,
      required: [true, "Please fill your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, " Please provide a valid email"],
    },
    address: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please fill your password"],
      minLength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    tokens: [{ type: Object }],
  },
  {
    timestamps: true,
  }
);

// Encrypt the password using 'bcryptjs'
userSchema.pre("save", async function (next) {
  // Check the password if it is modified
  if (!this.isModified("password")) {
    return next();
  }

  // Hashing the password
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// This function will be available on all documents in a certain collection
userSchema.methods.correctPassword = async function (typedPassword) {
  return await bcrypt.compare(typedPassword, this.password);
};

// This function will generate a JWT token for a user
userSchema.methods.generateToken = async function () {
  const payload = {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    active: this.active,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
};

const User = mongoose.model("User", userSchema);
export default User;

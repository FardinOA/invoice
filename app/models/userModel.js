import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

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
    passwordConfirm: {
      type: String,
      required: [true, "Please fill your password confirm"],
      validate: {
        validator: function (el) {
          // "this" works only on create and save
          return el === this.password;
        },
        message: "Your password and confirmation password are not the same",
      },
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
userSchema.methods.correctPassword = async function (
  typedPassword,
  originalPassword
) {
  return await bcrypt.compare(typedPassword, originalPassword);
};

const User = mongoose.model("User", userSchema);
export default User;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Note = require("./Note");
const Tag = require("./Tag");
require("dotenv").config();

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: [true, "Username already exists."],
      trim: true,
      minlength: [3, "Username must be at least 3 characters long."],
      maxlength: [30, "Username cannot exceed 30 characters."],
      validate: {
        validator: function (v) {
          return v.toLowerCase() !== "default";
        },
      }, // block 'default' as username
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [6, "Password must be at least 6 characters long."],
      maxlength: [50, "Password cannot exceed 50 characters."],
    },
  },
  {
    timestamps: true,
  },
);

// with virtual field to link:
// const userNotes = await Note.find({ user: userId });

// with no virtual field:
// const user = await User.findById(userId);
// const userNotes = await user.populate('notes');

userSchema.virtual("notes", {
  ref: "Note",
  localField: "_id",
  foreignField: "user",
}); // a virtual field to link user to the notes

// ==================================================
// ---------------- CUSTOM FUNCTIONS ----------------
// ==================================================

async function findByCredentials(username, password) {
  const user = await User.findOne({ username });
  if (!user) throw new Error("No user found.");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid password.");
  return user;
}

async function comparePassword(user, password) {
  return bcrypt.compare(password, user.password);
}

async function generateToken() {
  return jwt.sign(
    { _id: this._id.toString(), username: this.username },
    process.env.JWT_SECRET,
    { expiresIn: "7 days" },
  );
}

async function hashPassword(next) {
  const user = this;
  // only hash if it has been modified, meaning new or changed
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 4);
  }
  next();
}

async function deleteUserData(next) {
  const userToDelete = await this.model.findOne(this.getFilter());
  if (userToDelete) {
    await Note.deleteMany({ user: userToDelete._id });
    await Tag.deleteMany({ user: userToDelete._id });
  }
  next(); // proceed to delete the user
}

async function toJSON() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
}

// =============================================
// ---------------- MIDDLEWARES ----------------
// =============================================

// create new function: User.findByCredentials(username, password)
userSchema.statics.findByCredentials = findByCredentials;
userSchema.statics.comparePassword = comparePassword;

// create new function: user.generateToken()
userSchema.methods.generateToken = generateToken;

// overriding built-in Mongoose function
// hide private data when sending back user object
userSchema.methods.toJSON = toJSON;

// before saving the user: 'user.save'
userSchema.pre("save", hashPassword);

// before removing user: 'user.deleteOne'
userSchema.pre(
  "findOneAndDelete",
  { document: false, query: true },
  deleteUserData,
);

const User = mongoose.model("User", userSchema);
module.exports = User;

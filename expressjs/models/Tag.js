const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// prevent user from creating duplicate tags:
// different users can have tags with the same name,
// but one user cannot have two tags with the same name
// Ensure uniqueness only among non-deleted tags to allow recreating names after soft-delete
tagSchema.index(
  { name: 1, user: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

const Tag = mongoose.model("Tag", tagSchema);
module.exports = Tag;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blockSchema = new Schema( // id, data, type (text, checklist)
  {
    type: {
      type: String,
      default: 'text',
      enum: ['text', 'checklist'],
    },
    data: {
      text: {
        type: String,
      },
      checked: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    _id: false, // disable MongoDB _id for each sub-document block
  },
);

const noteSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      trim: true,
    },
    body: [blockSchema],
    isPinned: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tagUUIDs: [
      {
        type: String,
        default: [],
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    // Enable virtuals for JSON and object output
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

noteSchema.virtual('tags', {
  ref: 'Tag',
  localField: 'tagUUIDs', // Find the strings in the `tags` field of this schema (Note)
  foreignField: 'uuid', // Find documents in the `Tag` schema where the `uuid` field matches
  justOne: false, // populating an array of tags
});

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;

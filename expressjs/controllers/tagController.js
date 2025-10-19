const mongoose = require('mongoose');
const Tag = require('../models/Tag');
const Note = require('../models/Note');
const { returnStatus } = require('../helpers/helpers');

async function createTag(req, res) {
  try {
    const existingTag = await Tag.findOne({
      name: req.body.name,
      user: req.user._id,
      isDeleted: false,
    });
    if (existingTag) {
      return returnStatus(409, 'Tag already exists.', null, 'Conflict', res);
    }

    const tag = new Tag({
      uuid: req.body.uuid,
      name: req.body.name,
      user: req.user._id,
    });
    await tag.save();
    returnStatus(201, 'Tag created successfully.', tag, null, res);
  } catch (e) {
    console.log('createTag: ', e);
    returnStatus(500, 'Failed to create tag.', null, e.message, res);
  }
}

async function getTags(req, res) {
  try {
    const tags = await Tag.find({
      user: req.user._id,
      isDeleted: false,
    }).sort({ name: 1 });
    returnStatus(200, 'Tags retrieved successfully.', tags, null, res);
  } catch (e) {
    console.log('getTags: ', e);
    returnStatus(500, 'Failed to retrieve tags.', null, e.message, res);
  }
}

async function updateTag(req, res) {
  try {
    const tag = await Tag.findOne({
      uuid: req.params.id,
      user: req.user._id,
    });
    if (!tag) {
      return returnStatus(404, 'Tag not found.', null, 'Not Found', res);
    }

    if (req.body.name && req.body.name !== tag.name) {
      const existingTag = await Tag.findOne({
        name: req.body.name,
        user: req.user._id,
      });
      if (existingTag) {
        return returnStatus(409, 'Tag already exists.', null, 'Conflict', res);
      }
      tag.name = req.body.name;
    }

    await tag.save();
    returnStatus(200, 'Tag updated successfully.', tag, null, res);
  } catch (error) {
    console.log('updateTag: ', error);
    returnStatus(500, 'Failed to update tag.', null, error.message, res);
  }
}

async function deleteTag(req, res) {
  try {
    // Find tag by uuid and ensure it's not already deleted
    const tag = await Tag.findOne({
      uuid: req.params.id,
      user: req.user._id,
      isDeleted: false,
    });
    if (!tag) {
      return returnStatus(404, 'Tag not found.', null, 'Not Found', res);
    }

    // Prevent deletion if any non-deleted Note references this tag UUID
    const inUse = await Note.exists({
      user: req.user._id,
      tagUUIDs: tag.uuid,
      isDeleted: false,
    });
    if (inUse) {
      return returnStatus(
        409,
        'Tag is in use and cannot be deleted.',
        null,
        'Conflict',
        res,
      );
    }

    // Soft-delete the tag
    const updated = await Tag.findOneAndUpdate(
      { uuid: req.params.id, user: req.user._id, isDeleted: false },
      { isDeleted: true }, // Set the soft delete flag
      { new: true }, // Return the updated document
    );
    returnStatus(200, 'Tag deleted successfully.', updated, null, res);
  } catch (error) {
    console.log('deleteTag: ', error);
    returnStatus(500, 'Failed to delete tag.', null, error.message, res);
  }
}

async function getDeletedTags(req, res) {
  try {
    const tags = await Tag.find({ user: req.user._id, isDeleted: true }).sort({
      name: 1,
    });
    returnStatus(200, 'Deleted tags retrieved successfully.', tags, null, res);
  } catch (e) {
    console.log('getDeletedTags: ', e);
    returnStatus(500, 'Failed to retrieve deleted tags.', null, e.message, res);
  }
}

async function restoreTag(req, res) {
  try {
    const tag = await Tag.findOneAndUpdate(
      { uuid: req.params.id, user: req.user._id, isDeleted: true },
      { isDeleted: false }, // Clear the soft delete flag
      { new: true }, // Return the updated document
    );
    if (!tag)
      return returnStatus(
        404,
        'Tag not found or not deleted.',
        null,
        'Not Found',
        res,
      );
    returnStatus(200, 'Tag restored successfully.', tag, null, res);
  } catch (e) {
    console.log('restoreTag: ', e);
    returnStatus(500, 'Failed to restore tag.', null, e.message, res);
  }
}

async function permanentlyDeleteTag(req, res) {
  try {
    const tag = await Tag.findOneAndDelete({
      uuid: req.params.id,
      user: req.user._id,
      isDeleted: true,
    });
    if (!tag)
      return returnStatus(
        404,
        'Tag not found or not deleted.',
        null,
        'Not Found',
        res,
      );
    returnStatus(200, 'Tag permanently deleted successfully.', tag, null, res);
  } catch (e) {
    console.log('permanentlyDeleteTag: ', e);
    returnStatus(
      500,
      'Failed to permanently delete tag.',
      null,
      e.message,
      res,
    );
  }
}

module.exports = {
  createTag,
  getTags,
  updateTag,
  deleteTag,
  getDeletedTags,
  restoreTag,
  permanentlyDeleteTag,
};

const Note = require('../models/Note')
const Tag = require('../models/Tag')
const { returnStatus } = require('../helpers/helpers')


async function createNote(req, res) {
    try {
        const { uuid, title, body, isPinned, tagUUIDs } = req.body

        if (tagUUIDs && tagUUIDs.length > 0) {
            const validTags = await Tag.find({ uuid: { $in: tagUUIDs }, user: req.user._id })
            if (validTags.length !== tagUUIDs.length) {
                return returnStatus(400, 'One or more tags are invalid. In data field are the valid ones.', validTags, 'Bad Request', res)
            }
        }

        const note = new Note({
            uuid, title, body, isPinned, tagUUIDs,
            user: req.user._id,
        })
        await note.save()
        returnStatus(201, 'Note created successfully.', note, null, res)
    } catch (e) {
        console.log('createNote: ', e)
        returnStatus(400, 'Failed to create note.', null, e.message, res)
    }
}


async function getNotes(req, res) {
	const sort = {}
    const baseQuery = { user: req.user._id }

    if (req.query.keywords) {
        const searchRegex = { $regex: req.query.keywords, $options: 'i' }
        baseQuery.$or = [
            { title: searchRegex },
            { 'body.data.text': searchRegex } // Search within the nested text field
        ] // i: case-insensitive
    }

	if (req.query.tags) {
		baseQuery.tags = { $in: req.query.tags.split(',') }
	} // tags: ['tag1', 'tag2']

	if (req.query.sortBy) {
		const parts = req.query.sortBy.split(':') // ['title', 'asc']
		sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
	} // title:asc becomes { title: 1 }

	try {
		const notes = await Note.find(baseQuery)
			.populate('tagUUIDs', 'name') // Populate tags, only show 'name' field
			.sort(sort)
			.limit(parseInt(req.query.limit) || 10) // Default to 10 items per page
			.skip(parseInt(req.query.skip) || 0) // Default to the first page

		const totalNotes = await Note.countDocuments(baseQuery)
        const responseData = {
            total: totalNotes,
            page: parseInt(req.query.skip) / parseInt(req.query.limit) + 1 || 1,
            pages: Math.ceil(totalNotes / (parseInt(req.query.limit) || 10)),
            notes: notes
        }

        returnStatus(200, 'Notes retrieved successfully.', responseData, null, res)
    } catch (e) {
        console.log('getNotes: ', e)
        returnStatus(500, 'Failed to retrieve notes.', null, e.message, res)
    }
}


async function getNote(req, res) {
    try {
		const note = await Note
                .findOne({ uuid: req.params.id, user: req.user._id })
                .populate('tagUUIDs','name')
		if (!note) return returnStatus(404, 'Note not found.', null, null, res)
		returnStatus(200, 'Note retrieved successfully.', note, null, res)
	} catch (e) {
        console.log('getNote: ', e)
        returnStatus(500, 'Failed to retrieve note.', null, e.message, res)
    }
}


async function updateNote(req, res) {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'body', 'isPinned', 'tagUUIDs', 'isDeleted']
    // remove everything that is not allowed to be updated
    const filteredUpdates = updates.filter((update) => allowedUpdates.includes(update))
    try {
        const note = await Note.findOne({
			uuid: req.params.id,
			user: req.user._id
		})
        if (!note) return returnStatus(404, 'Note not found.', null, 'Not Found', res)
        filteredUpdates.forEach((update) => (note[update] = req.body[update]))
        await note.save()
        returnStatus(200, 'Note updated successfully.', note, null, res)
    } catch (e) {
        console.log('updateNote: ', e)
        returnStatus(500, 'Failed to update note.', null, e.message, res)
    }
}


async function deleteNote(req, res) {
    try {
        const note = await Note.findOneAndUpdate(
			{ uuid: req.params.id, user: req.user._id, isDeleted: false }, // Only delete if not already deleted
			{ isDeleted: true }, // Set the soft delete flag
			{ new: true } // Return the updated document
		)
        if (!note) return returnStatus(404, 'Note not found.', null, 'Not Found', res)
        returnStatus(200, 'Note deleted successfully.', note, null, res)
    } catch (e) {
        console.log('deleteNote: ', e)
        returnStatus(500, 'Failed to delete note.', null, e.message, res)
    }
}


async function getDeletedNotes(req, res) {
    try {
        const notes = await Note.find({ user: req.user._id, isDeleted: true })
        returnStatus(200, 'Deleted notes retrieved successfully.', notes, null, res)
    } catch (e) {
        console.log('getDeletedNotes: ', e)
        returnStatus(500, 'Failed to retrieve deleted notes.', null, e.message, res)
    }
}


async function restoreNote(req, res) {
    try {
        const note = await Note.findOneAndUpdate(
            { uuid: req.params.id, user: req.user._id, isDeleted: true },
            { isDeleted: false }, // Clear the soft delete flag
            { new: true } // Return the updated document
        )
        if (!note) return returnStatus(404, 'Note not found or not deleted.', null, 'Not Found', res)
        returnStatus(200, 'Note restored successfully.', note, null, res)
    } catch (e) {
        console.log('restoreNote: ', e)
        returnStatus(500, 'Failed to restore note.', null, e.message, res)
    }
}


async function permanentlyDeleteNote(req, res) {
    try {
        const note = await Note.findOneAndDelete({ uuid: req.params.id, user: req.user._id, isDeleted: true })
        if (!note) return returnStatus(404, 'Note not found or not deleted.', null, 'Not Found', res)
        returnStatus(200, 'Note permanently deleted successfully.', note, null, res)
    } catch (e) {
        console.log('permanentlyDeleteNote: ', e)
        returnStatus(500, 'Failed to permanently delete note.', null, e.message, res)
    }
}

module.exports = {
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote,
    getDeletedNotes,
    restoreNote,
    permanentlyDeleteNote
}
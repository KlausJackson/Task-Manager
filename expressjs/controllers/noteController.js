const Note = require('../models/Note')
const { returnStatus } = require('../helpers/helpers')


async function createNote(req, res) {
    try {
        const { title, body, isPinned, tags } = req.body
        const note = new Note({
            title, body, isPinned, tags,
            user: req.user._id,
        })
        await note.save()
        returnStatus(201, 'Note created successfully.', note, null, res)
    } catch (e) {
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
			.populate('tags', 'name') // Populate tags, only show 'name' field
			.sort(sort)
			.limit(parseInt(req.query.limit) || 10) // Default to 10 items per page
			.skip(parseInt(req.query.skip) || 0) // Default to the first page

		const totalNotes = await Note.countDocuments(baseQuery)
        const responseData = {
            notes: notes,
            total: totalNotes,
            page: parseInt(req.query.skip) / parseInt(req.query.limit) + 1 || 1,
            pages: Math.ceil(totalNotes / (parseInt(req.query.limit) || 10))
        }

        returnStatus(200, 'Notes retrieved successfully.', responseData, null, res)
    } catch (e) {
        returnStatus(500, 'Failed to retrieve notes.', null, e.message, res)
    }
}


async function getNote(req, res) {
    try {
		const note = await Note
                .findOne({ _id: req.params.id, user: req.user._id })
                .populate('tags','name')
		if (!note) return returnStatus(404, 'Note not found.', null, null, res)
		returnStatus(200, 'Note retrieved successfully.', note, null, res)
	} catch (e) {
        returnStatus(500, 'Failed to retrieve note.', null, e.message, res)
    }
}

async function updateNote(req, res) {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'body', 'isPinned', 'tags']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return returnStatus(400, 'Invalid updates!', null, 'Bad Request', res)
    }
    try {
        const note = await Note.findOne({
			_id: req.params.id,
			user: req.user._id
		})
        if (!note) return returnStatus(404, 'Note not found.', null, 'Not Found', res)
        updates.forEach((update) => (note[update] = req.body[update]))
        await note.save()
        returnStatus(200, 'Note updated successfully.', note, null, res)
    } catch (e) {
        returnStatus(500, 'Failed to update note.', null, e.message, res)
    }
}

async function deleteNote(req, res) {
    try {
        const note = await Note.findOneAndDelete(
			{ _id: req.params.id, user: req.user._id },
			{ isDeleted: true }, // Set the soft delete flag
			{ new: true } // Return the updated document
		)
        if (!note) return returnStatus(404, 'Note not found.', null, 'Not Found', res)
        returnStatus(200, 'Note deleted successfully.', note, null, res)
    } catch (e) {
        returnStatus(500, 'Failed to delete note.', null, e.message, res)
    }
}

module.exports = {
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote,
}
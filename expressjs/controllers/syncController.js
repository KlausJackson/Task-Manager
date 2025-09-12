const Note = require('../models/Note')
const Tag = require('../models/Tag')
const { returnStatus } = require('../helpers/helpers')


async function syncNotes(notes, user) {
	const operations = []
	const pushedNotes = []

	if (notes.created && notes.created.length > 0) {
		notes.created.forEach(n => {
			operations.push({
				insertOne: { document: { ...n, user } }
			})
			pushedNotes.push(n.uuid)
		})
	}

	if (notes.updated && notes.updated.length > 0) {
		notes.updated.forEach(n => {
			const { uuid, ...updateData } = n
			operations.push({
				updateOne: {
					filter: { uuid, user },
					update: { $set: updateData }
				}
			})
			pushedNotes.push(uuid)
		})
	}

	if (notes.deleted && notes.deleted.length > 0) {
		operations.push({
			updateMany: {
				filter: {
					uuid: { $in: notes.deleted },
					user
				},
				update: { $set: { isDeleted: true } }
			}
		})
		pushedNotes.push(...notes.deleted)
	}

	if (operations.length > 0) await Note.bulkWrite(operations)
	return pushedNotes
}


async function syncTags(tags, user) {
	const operations = []
	const pushedTags = []

    if (tags.created && tags.created.length > 0) {
        tags.created.forEach(tag => {
            operations.push({
                insertOne: { document: { ...tag, user } }
            });
            pushedTags.push(tag.uuid);
        });
    }

    if (tags.updated && tags.updated.length > 0) {
        tags.updated.forEach(tag => {
            const { uuid, ...updates } = tag;
            operations.push({
                updateOne: {
                    filter: { uuid, user },
                    update: { $set: updates }
                }
            });
            pushedTags.push(uuid);
        });
    }

    if (tags.deleted && tags.deleted.length > 0) {
        operations.push({
            deleteMany: {
                filter: { uuid: { $in: tags.deleted }, user }
            }
        });
    }

    if (operations.length > 0) await Tag.bulkWrite(operations);
    return pushedTags;
}


async function syncData(req, res) {
	try {
		const { lastSyncedAt, notes, tags } = req.query
		const sinceDate = lastSyncedAt ? new Date(lastSyncedAt) : new Date(0)

		let pushedNotes = []
		let pushedTags = []

		if (notes) pushedNotes = await syncNotes(notes, user)
		if (tags) pushedTags = await syncTags(tags, user)

		// gt: greater than
        const serverNotes = await Note.find({
            user: req.user._id,
            updatedAt: { $gt: sinceDate },
            uuid: { $nin: pushedNotes }
        });

        const serverTags = await Tag.find({
            user: req.user._id,
            updatedAt: { $gt: sinceDate },
            uuid: { $nin: pushedTags }
        });

		const data = {
			notes: serverNotes,
			tags: serverTags,
			timestamp: new Date().toISOString() // Server provides the new sync time
		}

		returnStatus(200, 'Sync data retrieved successfully.', data, null, res)
	} catch (error) {
		returnStatus(500, 'Sync failed.', null, error.message, res)
	}
}


module.exports = { syncData }

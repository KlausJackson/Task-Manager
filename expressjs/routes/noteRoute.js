const router = require('express').Router();
const noteController = require('../controllers/noteController');

router
  .route('/')
  .get(noteController.getNotes) // GET /notes
  .post(noteController.createNote); // POST /notes

router.get('/trash', noteController.getDeletedNotes); // GET /notes/trash
router.delete('/trash/:id', noteController.permanentlyDeleteNote); // DELETE /notes/trash/:id

router.put('/:id/restore', noteController.restoreNote); // PUT /notes/:id/restore

router
  .route('/:id')
  .get(noteController.getNote) // GET /notes/:id
  .put(noteController.updateNote) // PUT /notes/:id
  .delete(noteController.deleteNote); // DELETE /notes/:id

module.exports = router;

const router = require('express').Router();
const tagController = require('../controllers/tagController');

router
  .route('/')
  .get(tagController.getTags) // GET /tags
  .post(tagController.createTag); // POST /tags

router
  .route('/:id')
  .put(tagController.updateTag) // PUT /tags/:id
  .delete(tagController.deleteTag); // DELETE /tags/:id

// Trash endpoints (mirror notes routes)
router.get('/trash', tagController.getDeletedTags); // GET /tags/trash
router.delete('/trash/:id', tagController.permanentlyDeleteTag); // DELETE /tags/trash/:id

router.put('/:id/restore', tagController.restoreTag); // PUT /tags/:id/restore

module.exports = router;

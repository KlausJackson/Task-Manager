const router = require('express').Router();
const tagController = require('../controllers/tagController');


router.route('/')
    .get(tagController.getTags)        // GET /tags
    .post(tagController.createTag);    // POST /tags


router.route('/:id')
    .put(tagController.updateTag)      // PUT /tags/:id
    .delete(tagController.deleteTag);  // DELETE /tags/:id

module.exports = router;
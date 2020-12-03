const router = require('express').Router();
const {
	addComment,
	removeComment,
	addReply,
	removeReply
} = require('../../controllers/comment-controller');

// POST at /api/comments/<pizzaId>
router.route('/:pizzaId').post(addComment);

// PUT and DELETE /api/comments/<pizzaId>/<commentId>
router
  .route('/:pizzaId/:commentId')
  .put(addReply)
  .delete(removeComment);

// DELETE at /api/comments/<pizzaId>/<commentId>/<replyId>
router.route('/:pizzaId/:commentId/:replyId').delete(removeReply);

module.exports = router;

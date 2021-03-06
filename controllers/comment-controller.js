const { Comment, Pizza } = require('../models');


const commentController = {
	// add comment to pizza
	addComment({ params, body }, res) {
		console.log(body);
    Comment.create(body)
      // destructure new comment _id to add to pizza comments array
			.then(({ _id }) => {
				console.log(_id);
				return Pizza.findOneAndUpdate(
					// where
					{ _id: params.pizzaId },
					// new data
					{ $push: { comments: _id } },
					{ new: true }
				);
			})
			.then((dbPizzaData) => {
				if (!dbPizzaData) {
					res.status(404).json({ message: 'No pizza found with this id!' });
					return;
				}
				res.json(dbPizzaData);
			})
			.catch((err) => res.json(err));
	},

	addReply({ params, body }, res) {
		Comment.findOneAndUpdate(
			{ _id: params.commentId },
			{ $push: { replies: body } },
			{ new: true, runValidators: true }
		)
			.then((dbPizzaData) => {
				if (!dbPizzaData) {
					res.status(404).json({ message: 'No pizza found with this id!' });
					return;
				}
				res.json(dbPizzaData);
			})
			.catch((err) => res.json(err));
	},

	// remove comment
	removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
			.then((deletedComment) => {
				if (!deletedComment) {
					return res.status(404).json({ message: 'No comment with this id!' });
        }
        // here it is not necessary to destructure comment _id from above returned promise since we already have it in the params
				return Pizza.findOneAndUpdate(
					{ _id: params.pizzaId },
					{ $pull: { comments: params.commentId } },
					{ new: true }
				);
			})
			.then((dbPizzaData) => {
				if (!dbPizzaData) {
					res.status(404).json({ message: 'No pizza found with this id!' });
					return;
				}
				res.json(dbPizzaData);
			})
			.catch((err) => res.json(err));
	},

	// remove reply
	removeReply({ params }, res) {
		Comment.findOneAndUpdate(
			{ _id: params.commentId },
			{ $pull: { replies: { replyId: params.replyId } } },
			{ new: true }
		)
			.then((dbPizzaData) => res.json(dbPizzaData))
			.catch((err) => res.json(err));
	}
};

module.exports = commentController;

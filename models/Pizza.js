const { Schema, model } = require('mongoose');
const moment = require('moment');

// create Schema
const PizzaSchema = new Schema(
	{
		pizzaName : {
      type : String,
      required: true,
      trim: true
		},
		createdBy : {
      type : String,
      required: true,
      trim: true
		},
		createdAt : {
			type    : Date,
      default : Date.now,
      // transform data by default every time it's queried with getter
      get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
		},
		size      : {
      type    : String,
      required: true,
      enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
			default : 'Large'
		},
		toppings  : [],
    // create association with Comment 
    // comments is a subdocument
		comments  : [
			{
        // expect an id
        type : Schema.Types.ObjectId,
        // coming from the Comment model
				ref  : 'Comment'
			}
		]
	},
	{
		toJSON : {
      virtuals : true,
      getters: true
		},
		id     : false
	}
);

// get total count of comments and replies on retrieval -- virtual property
PizzaSchema.virtual('commentCount').get(function() {
  // return this.comments.length;
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;

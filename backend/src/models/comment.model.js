import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
	{
		comment: {
			type: String,
			required: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
			required: true,
		},
		parent: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
		},
	},
	{
		timestamps: true,
	}
);
export default Comment = mongoose.model("Comment", commentSchema);

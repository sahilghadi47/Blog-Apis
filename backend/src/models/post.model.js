import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			index: true,
		},
		content: {
			type: String,
			required: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		assets: {
			type: Object,
			default: {
				public_id: "",
				url: "",
			},
		},
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Like",
			},
		],
	},
	{
		timestamps: true,
	}
);

const Post = mongoose.model("Post", postSchema);
export default Post;

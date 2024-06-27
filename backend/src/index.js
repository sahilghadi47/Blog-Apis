import dotenv from "dotenv";
import connectMongoDB from "./config/database.config.js";
import app from "./app.js";
dotenv.config({
	path: ".env",
});
connectMongoDB()
	.then(() => {
		app.listen(process.env.PORT, () =>
			console.log(
				`Server is running at http://localhost:${process.env.port}`
			)
		);
	})
	.catch((err) => {
		console.log(err);
	});

class ErrorHandler extends Error {
	constructor(
		statusCode = 400,
		message = "something went wrong",
		errors = []
	) {
		super(message);
		this.statusCode = statusCode;
		this.message = message;
		this.errors = errors;
		this.success = false;
	}
}

class ResponseHandler {
	constructor(status, data, message = "success") {
		this.status = status;
		this.data = data;
		this.message = message;
		this.success = status >= 200 && status < 400;
	}
}

export { ErrorHandler, ResponseHandler };

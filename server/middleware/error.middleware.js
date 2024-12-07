const globalErrorHandler= (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
    })
}

class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode=statusCode;
        this.status = statusCode>=400 && statusCode<500 ? 'fail':'error';
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {globalErrorHandler, CustomError};
const errorHandler = (err, req, res, next) => {
    const origin = req.headers.origin;

    // Allow the origin from the request dynamically
    if (origin) {
        res.header('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Credentials', 'true');
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: 'error',
        statusCode: statusCode,
        message: err.message || 'Internal Server Error',
        details: err.details || null,
    });
};


module.exports = errorHandler;
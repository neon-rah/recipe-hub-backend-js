const errorHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            status: 400,
            error: 'Bad Request',
            message: err.message,
        });
    }

    if (err.message.includes('token') || err.message.includes('Authorization')) {
        return res.status(401).json({
            status: 401,
            error: 'Unauthorized',
            message: err.message,
        });
    }

    if (err.message.includes('Forbidden')) {
        return res.status(403).json({
            status: 403,
            error: 'Forbidden',
            message: err.message,
        });
    }

    return res.status(500).json({
        status: 500,
        error: 'Internal Server Error',
        message: err.message,
    });
};

module.exports = errorHandler;
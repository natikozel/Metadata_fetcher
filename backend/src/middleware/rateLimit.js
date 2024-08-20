const FetchError = require('../util/FetchError');


// Implemented my own but could've also used express-rate-limit instead
module.exports = (req, res, next) => {

    const ip = req.ip; // Requester Indicator
    const now = Date.now(); // Current time of request
    const windowMs = 1000; // One second
    const maxRequests = 5; // Maximum number of requests per second

    // rateLimitStore - Object that manages the rate limit
    if (!global.rateLimitStore) {
        global.rateLimitStore = {};
    }

    // Checking whether the same requester has already sent a request in the past second
    if (!global.rateLimitStore[ip]) {
        global.rateLimitStore[ip] = [];
    }

    // Filter out all requests whose second has already passed
    global.rateLimitStore[ip] = global.rateLimitStore[ip].filter(timestamp => now - timestamp < windowMs);

    // Check if the requester exceeds the limit and return an appropriate error if they do.
    if (global.rateLimitStore[ip].length >= maxRequests)
        return next(new FetchError(429, 'Too many requests, please try again later.'));

    // Add the current request to the appropriate counter managed by the rateLimitStore object.
    global.rateLimitStore[ip].push(now);
    next();
};

const hpp = require('hpp');

module.exports = hpp({
    checkQuery: true,
    checkBody: false, // false because it cause interferences with arrays
});
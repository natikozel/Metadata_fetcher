// Dependencies
const express = require('express');
const xss = require('xss');
const {createWriteStream} = require('fs');
const path = require("path");
const helmet = require('helmet');
const ssrf = require('ssrf');
const morgan = require('morgan');
const cors = require('cors');
const csrf = require('csurf');
const cookieParser = require('cookie-parser')
const errorHandler = require('./src/middleware/error')
const {isValidUrl} = require('./src/util/regexUtil');
const FetchError = require('./src/util/FetchError');
const secureFetchMetadata = require('./src/util/fetchMetadata');
const allowCors = require('./src/middleware/allowCors')

// Middlewares
const rateLimit = require('./src/middleware/rateLimit.js')
const headerProtection = require('./src/middleware/headerProtection.js');

const app = express();
const PORT = process.env.PORT || 8080;
const accessLogStream = createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});


app.use(rateLimit);
app.use(cors());
// app.use(allowCors);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use(headerProtection);
if (process.env.NODE_ENV !== 'test') {
    app.use(csrf({cookie: true}));
}
app.use(morgan('combined', {stream: accessLogStream}));


app.get('/test', (req, res) => {
    res.json({message: 'Hello World!'});
})


app.get('/csrf-token', (req, res) => {
    res.json({csrfToken: req.csrfToken()});
});

app.post('/fetch-metadata', async (req, res, next) => {
    const {urls} = req.body;
    try {
        if (!Array.isArray(urls)) {
            throw new FetchError(400, 'Please provide an array of URLs');
        }

        if (urls.length < 1)
            throw new FetchError(400, 'Please provide at least one URL');

        const invalidUrls = urls.filter(url => !isValidUrl(url))
        if (invalidUrls.length > 0)
            throw new FetchError(400, 'Invalid URL(s)', invalidUrls);


        const sanitizedUrls = [];
        for (const url of urls) {
            const ssrfSafeUrl = await ssrf.url(url);
            const sanitizedUrl = xss.filterXSS(ssrfSafeUrl);
            sanitizedUrls.push(sanitizedUrl);
        }

        // Handle errors in fetchMetadata and wait for all promises to resolve
        const metadata = await Promise.all(secureFetchMetadata(sanitizedUrls));

        res.status(200).json(metadata);
    } catch (error) {
        next(error)
    }
});

app.use(errorHandler)
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;
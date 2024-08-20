const cheerio = require('cheerio');
const axios = require('axios');
const FetchError = require('./FetchError');


const secureFetchMetadata = (sanitizedUrls) => {
    return sanitizedUrls.map(async (url) => {
        try {
            const {data: html} = await axios.get(url, {timeout: 5000});
            const $ = cheerio.load(html);
            return {
                url,
                title: $('meta[property="og:title"]').attr('content') || $('title').text(),
                description: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content'),
                image: $('meta[property="og:image"]').attr('content')
            };
        } catch (error) {
            if (error.code === 'ENOTFOUND') {
                throw new FetchError(404, 'DNS resolution failed', url);
            } else if (error.code === 'ECONNABORTED') {
                throw new FetchError(408, 'Connection timed out', url);
            } else if (error.response && error.response.status >= 300 && error.response.status < 400) {
                throw new FetchError(310, 'Too many redirects', url);
            } else if (error.response) {
                throw new FetchError(error.response.status, `HTTP error ${error.response.status} for ${url}`, error.response.statusText);
            } else {
                throw new FetchError(500, `Error fetching data from ${url}`, url);
            }
        }
    })
}


module.exports = secureFetchMetadata
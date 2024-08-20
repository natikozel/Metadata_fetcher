// Regular expression to validate URL
const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
const regex = new RegExp(expression);

const isValidUrl = (url) => {
    return url.match(regex);
}

module.exports = {isValidUrl}
const cheerio = require('cheerio')
const axios = require('axios')

module.exports = goodreadsLink => axios
                            .get(goodreadsLink)
                            .then(response => response.data)
                            .then(cheerio.load)
                            .then($ => $("#coverImage").attr("src"))
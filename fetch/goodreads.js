const convert = require('xml-js')
const axios = require('axios')

const alwaysArray = it => Array.isArray(it) ? it : [it]
const toBook = it => ({
    title: it.title._cdata || it.title._text,
    description: it.description._cdata,
    format: it.format._cdata,
    pages: it.num_pages._cdata,
    year: it.publication_year._text,
    ratingCount: it.work.ratings_count._text,
    ratingAvg: it.average_rating._text,
    reviewCount: it.work.text_reviews_count._text,
    link: it.link._cdata,
    authors: alwaysArray(it.authors.author).map($ => $.name._text)
})

module.exports = isbn => axios
                            .get(`https://www.goodreads.com/book/isbn/${isbn}?key=${process.env.GOODREADS_API_KEY}`)
                            .then(response => convert.xml2js(response.data, { compact: true, nativeType: true, ignoreDeclaration: true }))
                            .then(body => body.GoodreadsResponse.book)
                            .then(toBook)

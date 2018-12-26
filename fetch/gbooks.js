const dayjs = require('dayjs')
const axios = require('axios')

const toBook = it => ({
    cover: it.imageLinks.thumbnail.replace("zoom=1", "zoom=0"),
    description: it.description,
    pages: it.pageCount,
    year: dayjs(it.publishedDate).year()
})

module.exports = isbn => axios
                            .get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${process.env.GOOGLE_API_KEY}`)
                            .then(response => response.data)
                            .then(body => body.items)
                            .then(([item]) => item.volumeInfo)
                            .then(toBook)
                            .catch(_ => ({}))
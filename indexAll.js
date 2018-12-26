(async () => {
    const axios = require('axios')

    axios.interceptors.request.use(request => {
        console.log('🌍 Fetching', request.url)
        return request
    })

    const yaml = require('js-yaml')
    const util = require('util')
    const glob = require('glob')
    const globAsync = util.promisify(glob)

    const readFileSync = require('fs').readFileSync
    const readFileUtf8 = name => readFileSync(name, 'utf8')

    const algoliasearch = require('algoliasearch')
    const algolia = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)
    const index = algolia.initIndex(process.env.ALGOLIA_INDEX_NAME)

    const fileNames = await globAsync('./books/*.yml')
    
    const contributions = fileNames
                            .map(readFileUtf8)
                            .map(yaml.load)
    

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

    contributions.forEach(async contribution => {
    // contributions.filter(c => c.book.isbn == '9781934356852').forEach(async contribution => {
        const { isbn, description, tags } = contribution.book
        
        try {
            
            const goodreads = await require('./fetch/goodreads')(isbn)
            const gbooks = await require('./fetch/gbooks')(isbn)
            const cover = await require('./fetch/cover')(goodreads.link)

            const book = {
                objectID: isbn,
                about: tags,
                title: goodreads.title,
                description: description || goodreads.description || gbooks.description,
                ratingCount: goodreads.ratingCount,
                ratingAvg: goodreads.ratingAvg,
                reviewCount: goodreads.reviewCount,
                goodreadsLink: goodreads.link,
                by: goodreads.authors,
                cover: cover || gbooks.cover,
                pages: goodreads.pages || gbooks.pages,
                year: goodreads.year || gbooks.year
            }

            await index.saveObject(book)
            // await sleep(1000)
        } catch (e) {
            console.error(`😵 Sorry, things went wrong at ${isbn}.`, e)
        }
    })
})()


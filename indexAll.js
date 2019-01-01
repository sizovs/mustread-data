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

    const generateStats = require("./generateStats")
    const generateFeed = require("./generateFeed")
    const store = require('./store')
    
    const contributedFiles = (await globAsync('books/*.yml'))
                                    .map(contributedFile => [contributedFile, readFileUtf8(contributedFile)])
                                    .map(([contributedFile, content]) => ({...yaml.load(content), location: contributedFile}) )
              
    const outIfNeeded = c => true
    const booksInFuture = contributedFiles.filter(outIfNeeded).map(async contribution => {
        const { isbn, grid, description, tags } = contribution.book
        try {
            
            const goodreads = await require('./fetch/goodreads')(isbn, grid)
            const gbooks = await require('./fetch/gbooks')(isbn)
            const cover = await require('./fetch/cover')(goodreads.link)

            const book = {
                objectID: isbn,
                isbn: isbn,
                about: tags,
                location: contribution.location,
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

            return book
        } catch (e) {
            console.error(`😵 Sorry, things went fetching ${isbn}.`, e)
            return undefined
        }
    })

    
    
    const books = (await Promise.all(booksInFuture)).filter(book => book)
    await index.saveObjects(books)

    const stats = await generateStats(books)
    const feed = await generateFeed(books)
    
    await store(stats, feed)
})()


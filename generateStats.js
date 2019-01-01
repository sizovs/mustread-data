const dayjs = require('dayjs')
const GitFile = require('./classes/GitFile')

const commitMonth = rev => dayjs(rev.commit.date()).format('MMMM')

module.exports = books => 
    Promise
        .all(books
            .map(book => 
                    new GitFile(book.location)
                    .revs()
                    .then(([firstRev]) => {
                        let isbn = book.objectID
                        if (!firstRev) {
                            console.warn('😵 Cannot get git history of ' + book.location)
                            return undefined
                        } else {
                            return { isbn: isbn.toString(), month: commitMonth(firstRev) }
                        }
                    })
                )
            )
        .then(stats => stats
            .filter(stat => stat)
            .reduce((acc, curr) => 
                Object.assign(acc, {[curr.month]: [curr.isbn].concat(acc[curr.month] || [])}), {}
            ))
        .then(JSON.stringify)
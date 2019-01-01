import { Feed } from "feed"
import GitFile from './classes/GitFile'

const max = (among, attr) => new Date(Math.max(...among.map(item => attr(item))))

const emptyFeed = new Feed({
    title: 'The best books for developers – mustread.tech',
    description: "Open-source and crowd-sourced book listing",
    link: "http://mustread.tech",
    id: "http://static.mustread.tech/rss.xml",
    author: {
        name: "Eduards Sizovs"
    },
})

module.exports = books => 
    Promise
        .all(books
            .map(book => 
                    new GitFile(book.location)
                    .revs()
                    .then(([firstRev]) => {
                        if (!firstRev) {
                            console.warn('😵 Cannot get git history of ' + book.location)
                            return book
                        } else {
                            return { ...book, added: firstRev.commit.date() }
                        }
                    })
                )
            )
        .then(stats => stats
            .filter(stat => stat)
            .reduce((feed, book) => {
                feed.addItem({
                    id: "http://mustread.tech/books/isbn/" + book.objectID,
                    date: book.added,
                    link: "http://mustread.tech/books/isbn/" + book.objectID,
                    title: "Must-read book: " + book.title,
                    description: book.description.slice(0, 256) + "..."
                })
                feed.options.updated = max(feed.items, item => item.date)                
                return feed
            }, emptyFeed))
        .then(feed => feed.atom1())

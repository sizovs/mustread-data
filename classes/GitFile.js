const Git = require("nodegit")

class GitFile {
    constructor(location) {
        this.location = location
    }
    revs(count, order = Git.Revwalk.SORT.REVERSE) {
        return Git.Repository
            .open(".")
            .then(repo => repo.getMasterCommit().then(master => ([repo, master])))
            .then(([repo, master]) => {
                let walker = repo.createRevWalk()
                walker.push(master.sha())
                walker.sorting(order)
                return walker.fileHistoryWalk(this.location, count)})
    }
}

module.exports = GitFile
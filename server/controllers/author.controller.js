import Author from '../models/author.model'

const findAuthor = async (req, res, next, authorId) => {
    try {
        let author = await Author.findById(authorId).populate('books')
        req.author = author
    } catch (err) {
        console.log(err)
    }
    next()
}

const returnAuthor = (req, res) => {
    try {
        return res.json(req.author)
    }
    catch (err) {
        console.log(err)
    }
}

export default {
    findAuthor,
    returnAuthor
}
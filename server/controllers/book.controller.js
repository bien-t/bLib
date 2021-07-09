import Book from '../models/book.model'
import Author from '../models/author.model'
import errorHandler from '../helpers/dbErrorHandler'
import userCtrl from '../controllers/user.controller'
import formidable from 'formidable'


const addBook = (req, res) => {
    const form = formidable({
        keepExtensions: true,
        uploadDir: `${__dirname}/../uploads`,
        allowEmptyFiles: true,
        maxFileSize: 10 * 1024 * 1024,
    })
    form.parse(req, async (err, fields, file) => {
        try {
            console.log(file)
            let book = new Book(
                {
                    title: fields.title,
                    isbn: fields.isbn,
                    pages: fields.pages,
                    description: fields.description,
                    imgPath: fields.url ? fields.url : `/uploads/${file.image.path.split('uploads/')[1]}`
                })
            let findAuthors = await Author.find({ 'name': fields.author.split(',') }).select()
            let filteredAuthors = findAuthors.map(v => v.name)

            let difference = fields.author.split(',').filter(x => !filteredAuthors.includes(x));
            let authorsArray = difference.map((element) => {
                return { name: element }
            })

            let author = await Author.insertMany(authorsArray)
            let allAuthors = findAuthors.concat(author)
            let authorsIds = allAuthors.map((element) => {
                return element._id
            })

            book.authors = authorsIds;
            await book.save()

            for (let index = 0; index < authorsIds.length; index++) {
                await Author.findByIdAndUpdate(authorsIds[index], {
                    $push: {
                        books: book._id
                    }
                }, { useFindAndModify: false })

            }
            return res.json({
                message: 'A new book has been added'
            })
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
    })
}


const getBooks = async (req, res) => {
    try {
        let bLength = await Book.find()
        if (bLength.length === 0) {
            return res.json({
               
                    error: 'Library is empty'
     
            })
        }
        let books = await Book.find().select('title author isbn imgPath').populate('authors', 'name').skip(req.body.skip).limit(req.body.limit)
        bLength = bLength.length

        return res.json({ books: books, bLength: bLength})

    } catch (err) {
        console.log(err)
    }
}

const getBooksByIsbn = async (req, res, next, isbn) => {
    try {
        let book = await Book.findOne({
            isbn: isbn
        }).populate('authors', 'name');

        req.book = book;
    } catch (err) {
        console.log(err)
    }
    next()
}

const returnBook = async (req, res) => {
    try {
        if (req.book === null) {
            return res.json({ message: 'There is no book in our database with this isbn number' })
        } else {
            let user = await userCtrl.checkBook(req.session.user._id, req.book._id)
            res.json({ book: req.book, user: user })
        }
    }
    catch (err) {
        console.log(err)
    }
}

const search = async (req, res) => {
    try {
        const searchValue = req.body.searchValue
        const searchCategory = req.body.searchCategory
        if (searchValue.length === 0 || searchCategory === '') {
            return res.json({ error: 'Error: check the search value or category selection' })
        }
        let title;
        let book;
        let author;
        switch (searchCategory) {
            case 'title':
                title = await Book.find({
                    title: new RegExp(`${searchValue}`, 'i')
                }).populate('authors', 'name');
                return res.json(title)

            case 'isbn':
                book = await Book.find({
                    isbn: searchValue
                }).populate('authors', 'name');
                return res.json(book)

            case 'author':
                author = await Author.find({ name: new RegExp(`${searchValue}`, 'i') }).populate('books', 'title isbn imgPath')
                return res.json(author)

            default:
                break;
        }
    } catch (err) {
        console.log(err)
    }
}

export default {
    addBook,
    getBooks,
    getBooksByIsbn,
    returnBook,
    search
}
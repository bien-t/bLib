import User from '../models/user.model';
import Password from '../models/user.password.model';
import errorHandler from '../helpers/dbErrorHandler';
import config from '../../config/config';






const createAccount = async (req, res) => {
    try {
        let user = new User(req.body);
        const hashedPassword = req.body.password;
        await Password.create({ user, hashedPassword, password: req.body.password })
        await user.save()
        return res.status(200).json({
            message: "Successfully signed up!",
            _id: user._id
        })

    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const login = async (req, res) => {
    try {
        let user = await User.findOne({
            email: req.body.email
        })
        if (!user)
            return res.status('401').json({
                error: "User not found"
            })

        let password = await Password.findOne({
            user: user._id
        })

        if (!password.authenticate(req.body.password)) {
            return res.status('401').send({
                error: "Email and password don't match."
            })
        }
        req.session.user = { _id: user._id };

        return res.json({ _id: user._id })
    } catch (err) {
        return res.status('401').json({
            error: "Could not sign in"
        })
    }
}

const logout = (req, res) => {
    try {
        if (req.session.user) {
            req.session.destroy(err => {
                if (err) throw err;
                res.clearCookie(config.sessionName)
                return res.json({ message: 'deleted' })
            })

        } else {
            throw new Error('Something went wrong');
        }
    } catch (err) {
        console.log(err)
    }
}


const checkAuthorization = (req, res, next) => {
    try {
        const authorization = req.response && req.session && req.session.user._id == req.response._id;
        if (!(authorization)) {
            return res.status('403').json({
                error: "User is not authorized"
            })
        }
    } catch (err) {
        console.log(err)
    }
    next()
}


const returnUserInfo = (req, res) => {
    try {
        return res.json({ _id: req.response._id, email: req.response.email })
    }
    catch (err) {
        console.log(err)
    }
}

const findUser = async (req, res, next, userId) => {
    try {
        let user = await User.findById(userId).populate({
            path: 'books.bookId', populate: {
                path: 'authors'
            }
        })
        req.response = user

    } catch (err) {
        console.log(err)
    }
    next()
}
const checkBook = async (userId, bookId) => {
    return await User.find({ _id: userId }, {
        books: {
            $elemMatch: { bookId: bookId }
        }
    })
}

const addToCollection = async (req, res) => {
    try {
        let user = await checkBook(req.session.user._id, req.body.bookId)
        if (user[0].books.length === 0) {
            await User.findByIdAndUpdate(req.session.user._id, {
                $push: {
                    books: req.body
                }
            }, { runValidators: true, useFindAndModify: false })

        }

        if (user[0].books.length === 1) {
            user = await User.updateOne({ _id: req.session.user._id },
                { $set: { "books.$[element].status": req.body.status } },
                { arrayFilters: [{ "element.bookId": req.body.bookId }], runValidators: true, new: true })
        }

        return res.json(user)

    } catch (err) {
        console.log(err)
        return res.json({ error: err })
    }
}

const getCollection = async (req, res) => {
    try {
        if (req.response.books.length === 0) {
            return res.json({
                    error: 'Your collection is empty'
            })
        }
        let books = [];
        let filteredBooks = []
        let skip = (req.body.pages.currentPage * req.body.pages.limit);
        let limit = req.body.pages.limit;
        let bLength;

        if (req.body.status.status === 'All') {
            for (let index = skip; skip + limit > req.response.books.length ? index < req.response.books.length : index < skip + limit; index++) {
                books.push(req.response.books[index]);
            }
            bLength = req.response.books.length
        } else {
            filteredBooks = req.response.books.filter((book) => {
                return book.status === req.body.status.status
            })
            if (filteredBooks.length === 0) {
                return res.json({
                        error: 'No books'
                })
            }
            for (let index = skip; skip + limit > filteredBooks.length ? index < filteredBooks.length : index < skip + limit; index++) {
                books.push(filteredBooks[index]);
            }
            bLength = filteredBooks.length
        }

        res.json({ books: books, bLength: bLength})
    } catch (err) {
        console.log(err)
    }
}

const removeFromCollection = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.session.user._id, {
            $pull: {
                books: req.body
            }
        }, { runValidators: true, useFindAndModify: false })

        res.json({ message: "Deleted" })
    } catch (err) {
        console.log(err)
    }
}

const changeEmail = async (req, res) => {
    try {
        if (req.body.email === req.body.emailConfirmation && req.body.emailConfirmation !== '' && req.body.email !== '') {
            await User.findByIdAndUpdate(req.session.user._id, {
                email: req.body.email
            }, { runValidators: true, useFindAndModify: false })
            return res.json({ message: "Email adress has been updated" })

        }
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })

    }

}
const changePassword = async (req, res) => {
    try {
        if (req.body.password === req.body.passwordConfirmation && req.body.passwordConfirmation !== '' && req.body.password !== '') {

            const oldPasswordId = await Password.findOne({ user: req.session.user._id })
            await Password.create({ user: req.session.user._id, hashedPassword: req.body.password, password: req.body.password })
            await Password.findByIdAndDelete(oldPasswordId)

            return res.json({ message: "Password has been updated" })

        }
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })

    }

}
export default {
    createAccount,
    login,
    logout,
    checkAuthorization,
    returnUserInfo,
    findUser,
    addToCollection,
    getCollection,
    checkBook,
    removeFromCollection,
    changeEmail,
    changePassword
}

import express from 'express'

import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/authorization.controller'
import bookCtrl from '../controllers/book.controller'
import authorCtrl from '../controllers/author.controller'
const router = express.Router()

//Main
router.route('/api/signup')
    .post(userCtrl.createAccount)

router.route('/api/login')
    .post(userCtrl.login)

router.route('/api/logout')
    .delete(userCtrl.logout)

router.route('/api/verification')
    .get(authCtrl.initialCheck)
    
router.route('/api/search')
    .post(authCtrl.checkSession, bookCtrl.search)

//User
router.route('/api/user/:userId')
    .get(authCtrl.checkSession, userCtrl.checkAuthorization, userCtrl.returnUserInfo)

router.route('/api/user/:userId/email')
    .put(authCtrl.checkSession, userCtrl.checkAuthorization, userCtrl.changeEmail)

router.route('/api/user/:userId/password')
    .put(authCtrl.checkSession, userCtrl.checkAuthorization, userCtrl.changePassword)

router.route('/api/user/collection/:userId/add')
    .put(authCtrl.checkSession, userCtrl.checkAuthorization, userCtrl.addToCollection)

router.route('/api/user/collection/:userId')
    .post(authCtrl.checkSession, userCtrl.getCollection)
    .put(authCtrl.checkSession, userCtrl.checkAuthorization, userCtrl.removeFromCollection)

router.param('userId', userCtrl.findUser)

//Author
router.route('/api/author/:authorId')
    .get(authCtrl.checkSession, authorCtrl.returnAuthor)

router.param('authorId', authorCtrl.findAuthor)

//Book
router.route('/api/addBook')
    .post(authCtrl.checkSession, bookCtrl.addBook)

router.route('/api/books')
    .post(authCtrl.checkSession, bookCtrl.getBooks)

router.route('/api/books/:isbn')
    .get(authCtrl.checkSession, bookCtrl.returnBook)

router.param('isbn', bookCtrl.getBooksByIsbn)



export default router;
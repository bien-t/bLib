import mongoose from 'mongoose';
import crypto from 'crypto'

const PasswordSchema = new mongoose.Schema({
    hashedPassword: {
        type: String,
        required: 'Password is required',
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    salt: String

})

PasswordSchema.methods = {
    authenticate: function(unhashedPassword) {
      return this.encryptPassword(unhashedPassword) === this.hashedPassword
    },
    encryptPassword: function (password) {
        if (!password) return ''
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            return ''
        }
    },
    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
}

PasswordSchema.pre('save', function () {
    this.salt = this.makeSalt()
    this.hashedPassword = this.encryptPassword(this.hashedPassword)
})

PasswordSchema
    .virtual('password')
    .set(function (password) {
        if (password && (password.length < 6 || password.length > 20)) {
            this.invalidate('password', 'Password must have at least 6 characters and at most 20 characters')
        }
        if (this.isNew && !password) {
            this.invalidate('password', 'Password is required')
        }
    })


export default mongoose.model('Password', PasswordSchema)
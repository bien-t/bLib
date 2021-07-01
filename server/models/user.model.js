import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: 'Email address is required',
        unique: 'This email is already taken',
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
        maxlength:64,
    },
    books: [{
            _id:false,
            bookId: {
                type: mongoose.Schema.ObjectId,
                ref: 'Book',
            },
            status: {
                type: String,
                enum:['Completed','Plan to read','Reading'],
            }
        },
    ]
})

export default mongoose.model('User', UserSchema)
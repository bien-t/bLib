import mongoose from 'mongoose'

const AuthorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 64,
        required: 'Author is required',
    },
    books: [{    
        type: mongoose.Schema.ObjectId,
        ref: 'Book',
            },
    ]
})

export default mongoose.model('Author', AuthorSchema)
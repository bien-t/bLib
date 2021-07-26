import mongoose from 'mongoose'

const AuthorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Author is required',
        trim: true,
        maxlength: 64,
    },
    books: [{    
        type: mongoose.Schema.ObjectId,
        ref: 'Book',
            },
    ]
})

export default mongoose.model('Author', AuthorSchema)
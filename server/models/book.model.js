import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        maxlength: 64,
        required:true
    },
    isbn: {
        type: Number,
        required: true,
        unique: true,
        trim: true,

    },
    authors: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Author',
    }],
    pages: {
        type: Number,
        required: true,
    },
    description:{
        type:String,
        maxlength:2500
    },
    imgPath:{
        type:String,
        required:true,
        maxlength:2500
    }
})

BookSchema.path('isbn').validate(function (v) {
    v = v.toString()
    if (v.length < 13 || v.length > 13) {
        this.invalidate('isbn', 'Enter 13char isbn')
    }
})



export default mongoose.model('Book', BookSchema)
const mongoose = require('../db/events')

const tpSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    images:{
        type:Buffer,
        require:true
    },
    price:{
        type:Number,
        required:true
    }
},{
    timestamps:true
})

tpSchema.methods.toJSON = function (){
    const post = this
    const obj = post.toObject()
    delete obj.images
    return obj
}

const Post = mongoose.model('Post',tpSchema)
module.exports = Post
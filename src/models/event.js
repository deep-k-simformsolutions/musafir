const mongoose = require('../db/events')

const eventSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    age_group:{
        type:String,
    },
    from:{
        type:Date,
        require:true  
    },
    to:{
        type:Date,
        require:true
    },
    from_city:{
        type:String,
        require:true
    },
    to_city:{
        type:String,
        require:true
    },
    duration:{
        type:String,
        require:true
    },
    about:{
        type:String
    },
    schedule:{
        type:String
    },
    inclusion_exclusion:{
        type:String
    },
    price:{
        type:Number,
        require:true
    },
    images:[{
        type:Buffer
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'Admin'
    }
},{
    timestamps:true
})

eventSchema.methods.toJSON = function (){
    const post = this
    const obj = post.toObject()
    delete obj.images
    return obj
}

const Event = mongoose.model('Event',eventSchema)
module.exports = Event
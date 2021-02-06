const mongoose = require('mongoose')
const validator = require('validator')
const jwt= require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        trim:true,  
        unique:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email is invalid')
            }
        }
    },
    password:{
        type:String,
        require:true,
        minlength:7,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password can not contain self name')
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('age is not a negative number')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

userSchema.methods.toJSON = function(){  //because of toJSON we do not need to call everytime
    const user = this
    const obj = user.toObject()
    delete obj.password
    delete obj.tokens
    delete obj.avatar
    return obj
}
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})
userSchema.methods.generateAuthToken = async function(){      //methods-accessible on the instances(instances method)(do not use arrow function)
    const user = this              
    const token = jwt.sign({ _id: user._id.toString() },process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}
userSchema.statics.findByCredentials = async (email,password) =>{//statics-can be directly invoked by model(here User)(called model methods)
    const user = await User.findOne({ email })
    if(!user){
        throw new Error('Unable to find email')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('incorrect password')
    }
    return user
} 

//Hash the plain text password before saving
userSchema.pre('save',async function (next){        //here we can not use arrow function it gives error
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

userSchema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})
    next()
})

const User = mongoose.model('User',userSchema)
module.exports = User

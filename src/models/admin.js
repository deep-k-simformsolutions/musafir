const mongoose = require('../db/events')
const validate = require('validator')
const jwt= require('jsonwebtoken')
const bcrypt = require('bcrypt')

const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validater.isEmail(value)){
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
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }]
},{
    timestamps:true
})

adminSchema.methods.toJSON = function(){  
    const admin = this
    const obj = admin.toObject()
    delete obj.password
    delete obj.tokens
    return obj
}
adminSchema.methods.generateAuthToken = async function(){ 
    const admin = this              
    const token = await jwt.sign({ _id: admin._id.toString() },process.env.JWT_SECRET)
    admin.tokens = user.tokens.concat({ token })
    await admin.save()
    return token
}
adminSchema.statics.findByCredentials = async (email,password) =>{
    const admin = await Admin.findOne({ email })
    if(!admin){
        throw new Error('Unable to find email')
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    if(!isMatch){
        throw new Error('incorrect password')
    }
    return admin
}
//Hash the plain text password before saving
adminSchema.pre('save',async function (next){        
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

const Admin = mongoose.model('Admin',adminSchema)

module.exports = Admin
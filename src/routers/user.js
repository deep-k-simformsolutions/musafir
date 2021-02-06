const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail,sendCancelationEmail } = require('../email/account')

router.post('/users',async (req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        //sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.send({user , token})
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login',async (req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)  //here function name can be anythings
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})
router.post('/users/logout',auth,async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()   
    }
})
router.post('/users/logoutall', auth, async(req,res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }

})

router.get('/users/me',auth,async (req,res)=>{
    /*User.find({}).then((user)=>{
        res.send(user)
    }).catch((error)=>{
        res.status(500).send
    })*/
    /*try {
        const user = await User.find({})
        res.send(user)
    } catch (error) {
        res.status(500).send()
    }*/
    res.send(req.user)
})

router.get('/users/:id', async (req,res)=>{
    const id = req.params.id
    /*User.findById(id).then((user)=>{
        if(!user){
           return res.status(404).send()
        }
        res.send(user)
    }).catch((error)=>{
        res.status(500).send(error)
    })*/
    try {
        const user = await User.findById(id)
        if(!user){
            return res.status(404).send()
         }
         res.send(user)
    } catch (error) {
        res.status(500).send()
    }
    })
 router.patch('/users/me',auth,async (req,res)=>{
     const keyarray = ['name','email','password','age']
     const update = Object.keys(req.body)
     const isvalidoperation = update.every((update)=>{
         return keyarray.includes(update)
     })
     if(!isvalidoperation){
         return res.status(404).send('invalid key')
     }
     try {
         //const user = await User.findById(req.params.id)        //here we use middleware
         update.forEach((updates)=>{
             req.user[updates] = req.body[updates]
         })
         await req.user.save()
         res.send(req.user)
         //const user = await User.findByIdAndUpdate(req.params.id, req.body,{new:true,runValidators:true})
        /* if(!user){
             return res.status(404).send()
         }
         res.send(user)*/
     } catch (error) {
         res.status(400).send('can not find key or another value')
     }
 })
 router.delete('/users/me',auth,async (req,res)=>{
     try {
         /*const user = await User.findByIdAndDelete(req.user._id)
         if(!user){
            return res.status(404).send()*/
        await req.user.remove()
        sendCancelationEmail(req.user.email,req.user.name)
        res.send()
        }
         catch (error) {
        res.status(500).send(error)
 
     }
 })

 const upload = multer({
    //dest:'avatars',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
           return cb(new Error('file type must be jpg,jpeg or png'))
        }
        cb(undefined,true)
    }
})
 router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({ width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send()
})
router.get('/users/:id/avatar',async (req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send(error)
    }
   
})

module.exports = router

const express = require('express')
const Post = require('../models/events')
const multer = require('multer')
const sharp = require('sharp')
const router = express.Router()

const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error('please upload image file'))
        }
        cb(undefined,true)
    },

})

router.post('/events',upload.single('avatar'),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({ width:250,height:250}).png().toBuffer()
    const post = new Post({
        name:"gujrat",
        description:"best place",
        price:3000,
        images:buffer})
    try {
        await post.save() 
        res.status(200).send({post})
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/events',async (req,res)=>{
    try {
        const post = await Post.find({name:req.body.name, price:req.body.price})
        if(!post){
            return res.status(404).send('post not found')
        }   
    } catch (error) {
            res.status(400).send(error)
    }

})

module.exports = router
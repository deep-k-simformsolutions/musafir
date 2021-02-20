const express = require('express')
const Event = require('../models/event')
const multer = require('multer')
const sharp = require('sharp')
const adminauth = require('../middleware/adminauth')
const router = express.Router()

router.post('/event',adminauth, async(req,res)=>{
    const event = new Event({
        ...req.body,
        from:req.query.from,
        to:req.query.to,
        owner:req.admin._id})
    try {
        await event.save()
        res.send(event)
    } catch (error) {
        res.status(400).send(error)
    }
})
router.get('/event',adminauth,async(req,res)=>{
    try {
        await req.admin.populate('events').execPopulate()
        res.send(req.admin.events)
    } catch (error) {
        res.status(400).send(error)
    }
})
router.delete('/event/:id',adminauth,async(req,res)=>{
    try {
        const event = await Event.findOneAndDelete({_id:req.params.id,owner:req.admin._id})
        if(!event){
            return res.status(404).send()
        }
        res.send(event)
    } catch (error) {
        res.status(400).send(error)
    }
    
})
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
router.post('/event/:id',adminauth,upload.single('images'),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({ width:250,height:250}).png().toBuffer()
    const event = await Event.findById(req.params.id)
    event.images = event.images.concat(buffer)
    await event.save()
    res.status(200).send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
router.get('/event/:id',async(req,res)=>{
    try {
    const event = await Event.findById(req.params.id)
    if(!event || !event.images){
        throw new Error('Can not find event or Images')
    }
    res.set('Content-Type','image/png')
    res.send(event.images[1])
    } catch (error) {
        res.status(404).send(error)
    } 
})

module.exports = router
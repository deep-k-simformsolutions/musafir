const express = require('express')
const Admin = require('../models/admin')
const adminauth = require('../middleware/adminauth')

const router = express.Router()

router.post('/admin',async (req,res)=>{
    const admin = new Admin(req.body)
    try {
        await admin.save()
        const token = await admin.generateAuthToken()
        res.send({admin,token})
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/admin/login',async (req,res)=>{
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password)  
        const token = await admin.generateAuthToken()
        res.send({admin, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/admin/logout',adminauth,async (req,res)=>{
    try {
        req.admin.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.admin.save()
        res.send()
    } catch (error) {
        req.status(400).send()
    }
})

router.get('/admin/me',adminauth,async (req,res)=>{
    res.send(req.admin)
})
router.get('/admin/:id',adminauth,async (req,res)=>{
    const id = req.params.id
    try {
        const admin = await Admin.findById(id)
        if(!admin){
            return res.status(404).send('user noy found')
        }
        res.send(admin)
    } catch (error) {
        res.status(400).send(error)
    }
})
router.patch('/admin/me',adminauth,async (req,res)=>{
    const keyarray = ['name','email','password']
    const update = Object.key(req.body)
    const isContain = update.every((update)=>{
        return keyarray.includes(update)
    })
    if(!isContain){
        return res.status(404).send('invalid key!')
    }
    try {
        update.forEach((update) => {
            req.admin[update] = req.body[update]
        })
        await req.admin.save()
        res.send(req.admin)
    } catch (error) {
        res.status(400).send('can not find key or another value')
    }
})
router.delete('/admin/me',adminauth,async (req,res)=>{
    try {
       await req.admin.remove()
       //sendCancelationEmail(req.user.email,req.user.name)
       res.send()
       }
    catch (error) {
       res.status(500).send(error)
    }
})

module.exports = router
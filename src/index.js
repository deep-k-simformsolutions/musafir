const express = require('express')
const path = require('path')
const postRouter = require('./routers/events')
const adminRouter = require('./routers/admin')


const app = express()

const publicPath = path.join(__dirname,'../public') 
//const viewPath = path.join(__dirname,'../templates/views')
//const partialsPath = path.join(__dirname,'../templates/partials')


const port = process.env.PORT || 3000

app.use(express.static(publicPath))
app.use(express.json())
app.use(adminRouter)
app.use(postRouter)

app.listen(port,()=>{
    console.log(`server is on port ${port}!`)
})
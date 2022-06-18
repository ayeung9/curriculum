import express from 'express'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

const app = express()
const port = process.env.PORT || 3000
const database = {}

app.use(express.static('public'))
app.use(express.json({limit: '10mb'}))

app.get('/', (req, res) => {
    res.sendFile(`${process.cwd()}/queen.html`)
})

fs.mkdir('./public/images', (error) => {
    if (error) {
        console.log('./public/images already exists!')
    }
    else {
        console.log('Successfully created ./public/images')
    }
})

app.get('/api/images', (req, res) => {
    fs.readdir('./public/images', (error, data) => {
        if (error) {
            return res.status(500).json({error: error})
        }
        res.status(200).json(data)
    })
})

app.post('/api/images', (req, res) => {
    const {imageData} = req.body
    const imageName = `${uuidv4()}.png`
    fs.writeFile(`./public/images/${imageName}`, imageData, 'base64', (error) => {
        if (error) {
            return res.status(500).json({error: error})
        }
        database[imageName] = imageData
        return res.status(201).json({url:`${imageName}`})
    })
})

app.listen(port, () => {console.log(`> Server started on port ${port}`)})
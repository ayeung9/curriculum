import express from 'express'
import { dirname } from 'path'
import path from 'path'
import { fileURLToPath } from 'url'
import jimp from 'jimp'
import fs from 'fs'

const app = express()
const port = process.env.PORT || 3000
const __dirname = fileURLToPath(dirname(import.meta.url))
const files = {}
const users = {}

app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'routes')))
app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({ extended: false }))

app.get('/login', (req, res) => {
    res.sendFile(`${__dirname}/memelogin.html`)
})

app.post('/api/login', (req, res) => {
    const { username } = req.body
    if (!username) {
        return res.status(400).json({error: 'Username can not be empty.'})
    }
    users[username] = {...req.body}
    res.cookie('set-cookie', `username=${username}`)
    res.status(301).redirect(`/memechat`)
})

app.get('/memechat', (req, res) => {
    res.sendFile(`${__dirname}/memechat.html`)
})

app.post('/memechat', async (req, res) => {
    const {image, message, username} = req.body
    const user = users[username]
    if (!image) {
        return res.status(400).json({error: 'Please check if webcam is turned on as no image was passed through.'})
    }
    if (!message) {
        return res.status(400).json({error: 'Meme will not contain text if the textbox is empty'})
    }
    if (user) {
        return res.status(400).json({error: 'Username already exists, please choose new username'})
    }
    const imageData = Buffer.from(image, 'base64')
    const font = jimp.FONT_SANS_32_WHITE

    const jimpFont = await jimp.loadFont(font)
    const jimpImage = jimp.read(imageData)
        .then(image => {
            return image
            .print(jimpFont, 10, 10, message)
            .write(`routes/files/${username}.png`)
        })
        .catch(error => {
            console.log(error)
        })
    
    files[username] = `${username}.png`
    return res.status(200).send(`Meme for ${username} generated.`)
})

app.get('/api/messages', (req, res) => {
    fs.readdir(`${__dirname}/routes/files`, (error, data) => {
        if (error) {
            console.log(error)
        }
        data.forEach(e => {
            const username = e.split('.')[0]
            files[username] = e
        })
    })
    res.status(200).json(files)
})

app.get('/files/:filename', (req, res) => {
    const fileName = req.params.filename
    res.sendFile(`${__dirname}/files/${fileName}`)
})

app.listen(port, () => {console.log(`> Server started on port ${port}`)})
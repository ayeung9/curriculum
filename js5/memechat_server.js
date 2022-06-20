import express from 'express'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import jimp from 'jimp'

const app = express()
const port = process.env.PORT || 3000
const __dirname = fileURLToPath(dirname(import.meta.url))
const files = {}

app.use(express.static('public'))
app.use(express.json({limit: '10mb'}))

app.get('/login', (req, res) => {
    res.sendFile(`${__dirname}/memelogin.html`)
})

app.post('/api/login', (req, res) => {
    const { username } = req.body
    if (!username || !(/^[a-z0-9]+$/i).test(username)) {
        return req.status(400).json({error: 'Username can not be empty or non-alphanumeric.'})
    }
    res.set('set-cookie', `username=${username}`)
    res.status(301).redirect(`/memechat`)
})

app.get('/memechat', (req, res) => {
    res.sendFile(`${__dirname}/memechat.html`)
})

app.post('/memechat', async (req, res) => {
    const {image, message, username} = req.body
    if (!image) {
        return req.status(400).json({error: 'Please check if webcam is turned on as no image was passed through.'})
    }
    if (!message) {
        return req.status(400).json({error: 'Meme will not contain text if the textbox is empty'})
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
    fs.readdir(`${__dirname}/files`, (error, data) => {
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
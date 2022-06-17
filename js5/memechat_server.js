import express from 'express'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import jimp from 'jimp'
import pkg from 'jimp'

const app = express()
const port = process.env.PORT || 3000
const __dirname = fileURLToPath(dirname(import.meta.url))
const getBufferAsync = pkg
const files = {}

app.use(express.static('public'))
app.use(express.json({limit: '10mb'}))

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/memelogin.html`)
})

app.post('/', (req, res) => {
    const { username } = req.body
    res.set('set-cookie', `username=${username}`)
    res.status(202).redirect(`/memechat`)
})

app.get('/memechat', (req, res) => {
    res.sendFile(`${__dirname}/memechat.html`)
})

app.post('/memechat', async (req, res) => {
    const {image, message, username} = req.body
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
    return res.status(202).send(`Meme for ${username} generated.`)
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
    res.status(202).json(files)
})

app.get('/files/:filename', (req, res) => {
    const fileName = req.params.filename
    res.sendFile(`${__dirname}/files/${fileName}`)
})

app.listen(port, () => {console.log(`> Server started on port ${port}`)})
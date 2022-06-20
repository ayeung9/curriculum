import express from 'express'
import jimp from 'jimp'
import pkg from 'jimp'

const app = express()
const port = process.env.PORT || 3000
const getBufferAsync = pkg
const cache = {}

app.get('/memegen/api/:text', async (req, res) => {
    const url = req.query.src || 'https://placeimg.com/640/480/any'
    const keyParameter = `${req.params.text}-${req.query.black}-${req.query.src}-${req.query.blur}`
    const cachedData = cache[keyParameter] || {}
    const blur = +req.params.blur || 1
    const font = req.query.black ? jimp.FONT_SANS_32_BLACK : jimp.FONT_SANS_32_WHITE
    let buffer = cachedData.data
    if (!buffer) {
        const jimpFont = await jimp.loadFont(font)
        const image = await jimp.read(url)
            .then(image => image.blur(blur))

        await image.print(jimpFont, 10, 10, req.params.text)
        buffer = await image.getBufferAsync(jimp.MIME_JPEG)
            
        cache[keyParameter] = {
            creationTime: Date.now(),
            data: buffer}

        if (Object.keys(cachedData).length === 11) {
            const oldestImage = Object.keys(cachedData).sort((a,b) =>
                cachedData[b].creationTime - cachedData[a].creationTime).pop()
                delete cachedData[oldestImage]
            }
        }
        res.set('content-type', 'image/jpeg').send(buffer)
    })

app.listen(port, () => console.log(`> Server started on port ${port}`))

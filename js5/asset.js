import express from 'express'
import fs from 'fs'

const app = express()
const port = process.env.PORT || 3000
const deleteInterval = 5*60*1000

app.use(express.static('public'))
app.use(express.json())

const dataFiles = {}

const vaccumCleaner = () => {
    Object.keys(dataFiles).forEach(fileName => {
        console.log("Vaccum cleaner is running: ", fileName)
        if(dataFiles[fileName].created <= Date.now() - deleteInterval){
            console.log(`Vaccum cleaner is sucking up ${fileName}`)
            delete dataFiles[fileName]
            fs.unlink(`./api/files/${fileName}`, () => {})
        }
    })
    setTimeout(() => {
        vaccumCleaner()
    }, deleteInterval)
}

app.get('/', (req, res) => {
    res.sendFile(`${process.cwd()}/index.html`)
})

app.get('/api/files/:filename', (req, res) => {
    const fileName = req.params.filename
    return res.json(dataFiles[fileName])
})

app.get('/api/files', (req, res) => {
    return fs.readdir('./api/files', (err, data) => {
        res.json(data)
    })
})

app.post('/api/files', (req, res) => {
    const {name, content} = req.body
    console.log(`Creating ${name}`)
    fs.writeFile(`./api/files/${name}`, content, () => {})
    dataFiles[name] = {created: Date.now(), content}
    res.json({name})
})

fs.readdir('./api/files', (err, data) => {
    if (err) {
        console.log("Error reading file. Please check fs.readdir.")
    }
    data.forEach(fileName => {
        fs.readFile(`./api/files/${fileName}`, (err, content) => {
            if (err) {
                console.log("Error reading file. Please check data.forEach nest.")
            }
            console.log("Running this data.forEach nested loop for: ", fileName)
            dataFiles[fileName] = {created: Date.now(), content}
        })
    })
})

vaccumCleaner()

app.listen(port, () => {console.log(`> Server started on port ${port}`)})
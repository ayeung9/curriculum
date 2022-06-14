import express from 'express'
import multer from 'multer'
import Tesseract from 'tesseract.js'
import { v4 as uuidv4 } from 'uuid'

const app = express()
const port = process.env.PORT || 3000

const upload = multer({dest: './files'})
const jobs = {}

app.use(express.static('public'))
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(`${process.cwd()}/imageanalysis.html`)
})

app.post('/files', upload.any('images'), (req, res) => {
    if (!req.files) {
        return res.status(400).send('Please choose a file to upload!')
    }
    const id = uuidv4()
    jobs[id] = {
        finished: false,
        result: []
    }
    req.files.forEach(e => {
        Tesseract.recognize(`./${e.path}`, 'eng')
        .then(data => {
            console.log(data)
            jobs[id]['result'].push(data)
            if (jobs[id]['result'].length === req.files.length) {
                jobs[id]['finished'] = true
            }
        })
    })
    res.status(202).json({id, url: `/api/job/${id}`})
})

app.get('/api/job/:jobid', (req, res) => {
    const job = jobs[req.params.jobid]
    if (!job) {
        return res.status(404).json({error: 'Job not found'})
    }
    res.json(job)
})

app.listen(port, () => {console.log(`> Server started on port ${port}`)})
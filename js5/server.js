import express from 'express'
import fetch from 'node-fetch'

const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'))
app.use(express.json())

let messages = {}

app.use('/*', (req, res, next) => {
    fetch('https://js5.c0d3.com/auth/api/session', {
        headers: {
            Authorization: req.get('Authorization')
        }
    })
    .then(r=>r.json())
    .then(data => {
        req.user = data
        /*if (!data || !data.username) {
            return res.status(403).json({
                message: 'User is not authorized.'
            })
        }*/
        next()
    })
})

app.get('/:roomname?', (req, res) => {
    res.sendFile(`${process.cwd()}/index.html`)
})

app.get('/api/session', (req, res) => {
    const user = req.user.body
    console.log(user)
    /*if (user.error) {
        return res.status(403).json({
            message: 'Not Authorized.'
        })
    }*/
    res.json({user})
})

app.post('/api/:room/messages', (req, res, next) => {
    const room = req.params.room
    const text = req.body.text
    const username = req.user.body.username
    if(messages[room]){
        messages[room].push({text, username})
    }
    else{
        messages[room] = [{text, username}]
    }
})


app.listen(port, () => {console.log(`> Server started on port ${port}`)})
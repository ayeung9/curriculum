import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const app = express()
const port = process.env.PORT || 3000
const saltRounds = 10
const jwtPassword = 'password'
const users = {}
const existingEmails = {}
const existingUsernames = {}

app.use(express.static('public'))
app.use(express.json())

app.get('/api/sessions', (req, res) => {
    const jwtToken = (req.get('Authorization') || '').replace('Bearer ', '')
    jwt.verify(jwtToken, jwtPassword, (error, decoded) => {
      if (error || !decoded || !decoded.username)   {
        return res.status(403).json({error: 'Username does not exist.'})
      }
      return res.status(200).json(users[decoded.username])
    })
})

app.post('/api/users', (req, res) => {
    const {name, username, password, email} = req.body || {}

    if (!password || password.length <= 5) {
        return req.status(400).json({error: 'Password length can not be less than 5 characters.'})
    }
    if (!username || !(/^[a-z0-9]+$/i).test(username)) {
        return req.status(400).json({error: 'Username can not be empty or non-alphanumeric.'})
    }
    if (existingUsernames[username]) {
        return req.status(400).json({error: 'Username already taken. Please pick another username.'})
    }
    if (!email || !(/^[0-9?A-z0-9?]+(\.)?[0-9?A-z0-9?]+@[A-z]+\.[A-z]{3}.?[A-z]{0,3}$/g).test(email)) {
        return req.status(400).json({error: 'Incorrect email format.'})
    }
    if (existingEmails[email]) {
        return req.status(400).json({error: 'Email already exists.'})
    }

    bcrypt.hash(password, saltRounds, (error,hash) => {
        if (error) {
            console.log('Error in bcrypt.hash:' ,error)
        }
        const jwtToken = jwt.sign({ username: username }, jwtPassword)
        users[username] = {...req.body, password: hash, jwt: jwtToken}
        existingEmails[email] = username
        res.json(users[username])
    })
})

app.post('/api/sessions', (req, res) => {
    const { username, password } = req.body || {}
    const user = users[username]

    if (!user) {
        return res.status(403).json({error: 'Username does not exist.'})
    }

    bcrypt.compare(password, user.password, (error, result) => {
        if (!result || error) {
            return res.status(403).json({error: 'Password does not match.'})
        }
        return res.status(201).json(user)
    })
})

app.listen(port, () => {console.log(`> Server started on port ${port}`)})
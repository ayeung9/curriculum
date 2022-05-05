import express from 'express'
import { exec } from 'child_process'

const app = express()
const port = process.env.PORT || 3000
const acceptableCommands = ['cat', 'ls', 'pwd']
app.use(express.static('./'))
app.use(express.json())

app.post('/api/commands', (req, res) => {
    let acceptableCommand = false
    const {command} = req.body
    acceptableCommands.some(cmd => {
        if (command.includes(cmd)) {
            acceptableCommand = true
            return
        }
    })
    if (!acceptableCommand) {
        return res.json('You entered an unacceptable command! Refer to acceptable commands listed above.')
    }
    exec(command, (error, stdout) => {
        if (error){
            return res.json(error)
        }
        return res.json(stdout)
    })
})

app.get('/', (req, res) => {
    res.send(`
    <div>
        <h1>Commands</h1>
        <p>For the security of our server, only a few commands are allowed. Try some of these:</p>
        <p>cat</p>
        <p>ls</p>
        <p>pwd</p>
        <input type="text" class="command">
        <header>
        <div class="display"></div>
    </div>
    <script>
        const command = document.querySelector('.command')
        const display = document.querySelector('.display')
        command.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                fetch('/api/commands', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        command: command.value
                    })
                })
                  .then(r => {
                    return r.json()
                  })
                  .then(data => {
                    display.innerText = data
                    command.value = ''
                   })
            }
        })
    </script>
    `)
})

app.listen(port, () => console.log(`> Server started on port ${port}`))
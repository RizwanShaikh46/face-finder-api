const express = require('express')
const cors = require('cors')
const database = {
    user: [
        {
            name: 'John',
            id: '123',
            email: 'John@gmail.com',
            password: 'apple',
            entries: '1',
            joined: new Date()
        },
        {
            name: 'Sally',
            id: '124',
            email: 'Sally@gmail.com',
            password: 'bananas',
            entries: '1',
            joined: new Date()
        }
        
    ]
}
const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send(database.user)
})


app.post('/signin', (req, res) => {
    if (req.body.email === database.user[0].email && req.body.password === database.user[0].password) {
        res.json(database.user[0])
    }
    else {
        res.status(404).json('Error finding user')
    }
})

app.post('/register', (req, res) => {
    const {email, password, name} = req.body
    database.user.push({
        name: name,
        id: '125',
        email: email,
        entries: 0,
        joined: new Date()
    })

    res.json(database.user[database.user.length - 1])
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params
    let found = false
    database.user.forEach(item => {
        if (item.id === id ) {
            found = true
            return res.json(item)
        }
    })
    if (!found) {
        res.status(404).json('Not found')
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body
    let found = false 
    database.user.forEach(item => {
        if (item.id === id) {
            found = true
            item.entries++
            res.json(item.entries)
        }
    })
    if (!found) {
        res.status(404).json('NOt found')
    }
})

app.listen(3000, () => {
    console.log('app is running on port 3000')
})
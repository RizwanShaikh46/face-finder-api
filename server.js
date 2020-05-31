const express = require('express')
const cors = require('cors')
const knex = require('knex')
const bcrypt = require('bcrypt-nodejs')


const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '9702477005Riz',
      database : 'facefinder'
    }
  });



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
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
        if (isValid) {
            return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then (user => res.json(user[0]))
        }
        res.status(400).json('wrong credentials')
    }).catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
    const {email, password, name} = req.body
    const hash = bcrypt.hashSync(password)
   db.transaction(trx => {
       trx.insert({
           hash: hash,
           email: email
       })
       .into('login')
       .returning('email')
       .then(loginEmail => {
           return trx('users')
           .returning('*')
           .insert({
               email: loginEmail[0],
               name: name,
               joined: new Date()
           })
           .then(user => {
               res.json(user[0])
           })
       })
       .then(trx.commit)
       .catch(trx.rollback)
   })
   .catch(err => res.json('unable to register'))

})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params

    db.select('*').from('users').where({id})
    .then(user => {
        if(user.length){
        res.json(user[0])
    } else {
        res.status(400).json('Not Found')
    }
})

})

app.put('/image', (req, res) => {
    const { id } = req.body
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3000, () => {
    console.log('app is running on port 3000')
})
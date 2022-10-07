const express = require('express')
const fs = require("fs")
const { v4: uuidv4 } = require('uuid');
const axios = require('axios')
const Redis = require('redis')
const {Client} = require('pg')

const cors = require("cors")
const app = express();
app.use(cors());
app.use(express.json());
const dataFilePath = "./data.json"

// Base url
app.get('/', (req, res) => {
    res.send("Hello World from index.js")
})

// Get all user
app.get('/user', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataFilePath))
    res.send(data)
});

// Get user by id
app.get('/user/:id', (req, res) => {
    const id = req.params.id
    const data = JSON.parse(fs.readFileSync(dataFilePath))
    const user = data[id]
    if (!user) {
        res.status(404).send({"message" : "User does not exist"})
        return
    }
    res.send(user)
});

// Create user
app.post('/user', (req, res) => {
    try {
        const user = req.body
        if (!user.name || !user.age || !user.phone) {
            res.status(404).send({"message" : "Wrong format for POST request body"})
            return
        }

        const data = JSON.parse(fs.readFileSync(dataFilePath))
        const userUuid = uuidv4()
        data[userUuid] = user
        fs.writeFileSync(dataFilePath, JSON.stringify(data))
        res.send({
            "message" : "POST Success",
            "userId" : userUuid
        })
    } catch (err) {
        console.log(err)
    }
});

// Update user by id
app.put('/user/:id', (req, res) => {
    try {
        const user = req.body
        const userUuid = req.params.id
        if (!user.name || !user.age || !user.phone) {
            res.status(404).send({"message" : "Wrong format for PUT request body"})
            return
        }
        
        const data = JSON.parse(fs.readFileSync(dataFilePath))
        
        if (!data[userUuid]) {
            res.status(404).send({"message" : "User does not exist"})
            return
        }

        data[userUuid] = user
        fs.writeFileSync(dataFilePath, JSON.stringify(data))
        res.send({
            "message" : "PUT Success",
            "userId" : userUuid
        })
    } catch (err) {
        console.log(err)
    }
});

// Delete user by id
app.delete('/user/:id', (req, res) => {
    try {
        const userUuid = req.params.id
        const data = JSON.parse(fs.readFileSync(dataFilePath))
        const user = data[userUuid]
        if (!user) {
            res.status(404).send({"message" : "User does not exist"})
            return
        }
        delete data[userUuid]
        fs.writeFileSync(dataFilePath, JSON.stringify(data))
        res.send({
            "message" : "DELETE Success",
            "userId" : userUuid
        })
    } catch (err) {
        console.log(err)
    }
});

// Get Redis data
const redisClient = Redis.createClient();
const pgClient = new Client({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    port: 5432,
    database: 'cs3219'
})
pgClient.connect()

app.get('/redis', async (req, res) => {
    redisClient.get('modules', async (err, modulesData) => {
        if (err) console.error(err)
        
        if (modulesData != null) {
            return res.json(JSON.parse(modulesData))
        } else {
            // axios.get("https://api.nusmods.com/v2/2022-2023/moduleList.json")
            // .then(res => res.data)
            // .then(data => {
            //     redisClient.set("modules", JSON.stringify(data))
            //     return res.json(data)
            // })
            pgClient
                .query('SELECT * FROM "redisTable" UNION ALL SELECT * FROM "redisTable" UNION ALL SELECT * FROM "redisTable" UNION ALL SELECT * FROM "redisTable" UNION ALL SELECT * FROM "redisTable"')
                .then(data => {
                    redisClient.set("modules", JSON.stringify(data.rows))
                    return res.json(data.rows)
                })
                .catch(e => console.error(e.stack))
        }
    })
});

module.exports = app

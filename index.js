const express = require('express')
const fs = require("fs")
const { v4: uuidv4 } = require('uuid');

const cors = require("cors")
const app = express();
app.use(cors());
app.use(express.json());
const dataFilePath = "./data.json"

// Base url
app.get('/', (req, res) => {
    res.send("Hello World from index.js with CICD")
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

module.exports = app

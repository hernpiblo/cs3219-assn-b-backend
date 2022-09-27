const app = require('./index')
const request = require('supertest')
const fs = require('fs');

beforeEach(() => {
    jest.setTimeout(10000)
    fs.copyFile('./data-initial.json', './data.json', (err) => {
      if (err) throw err;
    });
})

// GET ALL
// SUCCESS
describe('GET all users success', () => {

    test('Should respond with status code 200', async () => {
        const res = await request(app).get("/user")
        expect(res.statusCode).toBe(200)
    })

    test('Should specify json in content type header', async () => {
        const res = await request(app).get("/user")
        expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
    })
    
})

// GET ONE
// SUCCESS
describe('GET one user success', () => {

    test('Should respond with status code 200', async () => {
        const res = await request(app).get("/user/d5ab97d7-6a24-4b81-9c80-6895cf54c884")
        expect(res.statusCode).toBe(200)
    })

    test('Should specify json in content type header', async () => {
        const res = await request(app).get("/user/d5ab97d7-6a24-4b81-9c80-6895cf54c884")
        expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
    })

    test('Should contain name field and should equal Alice in response body', async () => {
        const res = await request(app).get("/user/d5ab97d7-6a24-4b81-9c80-6895cf54c884")
        expect(res.body.name).toBeDefined()
        expect(res.body.name).toBe("Alice")
    })

    test('Should contain age field and should equal 21 in response body', async () => {
        const res = await request(app).get("/user/d5ab97d7-6a24-4b81-9c80-6895cf54c884")
        expect(res.body.age).toBeDefined()
        expect(res.body.age).toBe(21)
    })

    test('Should contain phone field and should equal 81111111 in response body', async () => {
        const res = await request(app).get("/user/d5ab97d7-6a24-4b81-9c80-6895cf54c884")
        expect(res.body.phone).toBeDefined()
        expect(res.body.phone).toBe("81111111")
    })

})

// FAIL
describe('GET one user fail', () => {

    test('Should respond with status code 404', async () => {
        const res = await request(app).get("/user/invalid-user-id")
        expect(res.statusCode).toBe(404)
    })

    test('Should respond with error message', async () => {
        const res = await request(app).get("/user/invalid-user-id")
        expect(res.body.message).toBe("User does not exist")
    })

})

// POST
// SUCCESS
describe('POST one user success', () => {

    const postBody = {
        "name" : "Emily",
        "age" : 25,
        "phone" : "85555555"
    }

    test('Should respond with status code 200', async () => {
        const res = await request(app).post("/user").send(postBody)
        expect(res.statusCode).toBe(200)
    })

    test('Should specify json in content type header', async () => {
        const res = await request(app).post("/user").send(postBody)
        expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
    })

    test('Should contain success message in response body', async () => {
        jest.setTimeout(10000)
        const res = await request(app).post("/user").send(postBody)
        expect(res.body.message).toBeDefined()
        expect(res.body.message).toBe("POST Success")
    })

})

// FAIL
describe('POST one user fail', () => {

    const postBodyWrongKey = {
        "NAME" : "Emily",
        "age" : 25,
        "phone" : "85555555"
    }
    const postBodyMissingKey = {
        "name" : "Emily",
        "age" : 25,
    }
    const postBodyMissingValue = {
        "name" : "Emily",
        "age" : 25,
        "phone" : ""
    }

    const errorMessage = "Wrong format for POST request body"

    test('Should respond with status code 404 (postBodyWrongKey)', async () => {
        const res = await request(app).post("/user").send(postBodyWrongKey)
        expect(res.statusCode).toBe(404)
        expect(res.body.message).toBe(errorMessage)
    })

    test('Should respond with status code 404 (postBodyMissingKey)', async () => {
        const res = await request(app).post("/user").send(postBodyMissingKey)
        expect(res.statusCode).toBe(404)
        expect(res.body.message).toBe(errorMessage)
    })

    test('Should respond with status code 404 (postBodyMissingValue)', async () => {
        const res = await request(app).post("/user").send(postBodyMissingValue)
        expect(res.statusCode).toBe(404)
        expect(res.body.message).toBe(errorMessage)
    })

})

// PUT
// SUCCESS
describe('PUT one user success', () => {

    const putBody = {
        "name" : "Alice NEW",
        "age" : 30,
        "phone" : "58888888"
    }

    test('Should respond with status code 200', async () => {
        const res = await request(app).put("/user/d5ab97d7-6a24-4b81-9c80-6895cf54c884").send(putBody)
        expect(res.statusCode).toBe(200)
    })

    test('Should specify json in content type header', async () => {
        const res = await request(app).put("/user/d5ab97d7-6a24-4b81-9c80-6895cf54c884").send(putBody)
        expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
    })

    test('Should contain success message in response body', async () => {
        jest.setTimeout(10000)
        const res = await request(app).put("/user/d5ab97d7-6a24-4b81-9c80-6895cf54c884").send(putBody)
        expect(res.body.message).toBeDefined()
        expect(res.body.message).toBe("PUT Success")
    })

})

// FAIL
describe('PUT one user fail', () => {

    const putBodyWrongKey = {
        "NAME" : "Emily",
        "age" : 25,
        "phone" : "85555555"
    }
    const putBodyMissingKey = {
        "name" : "Emily",
        "age" : 25,
    }
    const putBodyMissingValue = {
        "name" : "Emily",
        "age" : 25,
        "phone" : ""
    }
    const putBody = {
        "name" : "Alice NEW",
        "age" : 30,
        "phone" : "58888888"
    }

    const errorMessage = "Wrong format for PUT request body"

    test('Should respond with status code 404 (putBodyWrongKey)', async () => {
        const res = await request(app).put("/user/d5ab97d7-6a24-4b81-9c80-6895cf54c884").send(putBodyWrongKey)
        expect(res.statusCode).toBe(404)
        expect(res.body.message).toBe(errorMessage)
    })

    test('Should respond with status code 404 (putBodyMissingKey)', async () => {
        const res = await request(app).put("/user/d5ab97d7-6a24-4b81-9c80-6895cf54c884").send(putBodyMissingKey)
        expect(res.statusCode).toBe(404)
        expect(res.body.message).toBe(errorMessage)
    })

    test('Should respond with status code 404 (putBodyMissingValue)', async () => {
        const res = await request(app).put("/user/d5ab97d7-6a24-4b81-9c80-6895cf54c884").send(putBodyMissingValue)
        expect(res.statusCode).toBe(404)
        expect(res.body.message).toBe(errorMessage)
    })

    test('Should respond with status code 404 (Invalid User)', async () => {
        const res = await request(app).put("/user/invalid-user-id").send(putBody)
        expect(res.statusCode).toBe(404)
        expect(res.body.message).toBe("User does not exist")
    })
})


// DELETE
// SUCCESS
describe('DELETE one user success', () => {

    test('Should respond with status code 200', async () => {
        const res = await request(app).delete("/user/d5ab97d7-6a24-4b81-9c80-6895cf54c884")
        expect(res.statusCode).toBe(200)
    })

    test('Should specify json in content type header', async () => {
        const res = await request(app).delete("/user/d5ab97d7-6a24-4b81-9c80-6895cf54c884")
        expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
    })

    test('Should contain success message in response body', async () => {
        const res = await request(app).delete("/user/d5ab97d7-6a24-4b81-9c80-6895cf54c884")
        expect(res.body.message).toBeDefined()
        expect(res.body.message).toBe("DELETE Success")
    })

    test('Should contain deleted userId in response body', async () => {
        const res = await request(app).delete("/user/d5ab97d7-6a24-4b81-9c80-6895cf54c884")
        expect(res.body.userId).toBeDefined()
        expect(res.body.userId).toBe("d5ab97d7-6a24-4b81-9c80-6895cf54c884")
    })

})

// FAIL
describe('DELETE one user fail', () => {

    test('Should respond with status code 404', async () => {
        const res = await request(app).delete("/user/invalid-user-id")
        expect(res.statusCode).toBe(404)
    })

    test('Should respond with error message', async () => {
        const res = await request(app).delete("/user/invalid-user-id")
        expect(res.body.message).toBe("User does not exist")
    })

})


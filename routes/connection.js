const { Router } = require("express")
const isAuth = require("../middleware/is-auth")
const Request = require("../models/request")
const Connection = require("../models/connection")

const app = Router()

app.post("/createConnection", isAuth,  async (req, res) => {
    req.body.from = req.user._id
    const required = ["to", "type", "from"]
    for(const key in Object.keys(req.body)) {
        if(!required.includes(key) || !req.body[key].length) {
            return res.status(400).send({
                status: "fail",
                message: `The ${key} is missing in the request`
            })
        }
    }
    if(req.body.type !== "MUTUAL") {
        return res.status(400).send({
            status: "fail",
            message: `This method is used for creating a mutual connection request`
        })
    }
    const request = await Request.create(req.body)
    if(!request) {
        return res.status(400).send({
            status: "fail",
            message: "Database error occurred"
        })
    }
    res.status(200).send({ status: "success", request })
})

app.post("/acceptRequest", isAuth,  async (req, res) => {
    req.body.from = req.user._id
    const required = ["to", "type", "from"]
    for(const key in Object.keys(req.body)) {
        if(!required.includes(key) || !req.body[key].length) {
            return res.status(400).send({
                status: "fail",
                message: `The ${key} is missing in the request`
            })
        }
    }
    if(req.body.type !== "MUTUAL") {
        return res.status(400).send({
            status: "fail",
            message: `This method is used for creating a mutual connection request`
        })
    }
    const request = await Request.find(req.body)
    if(!request) {
        return res.status(400).send({
            status: "fail",
            message: "Database error occurred"
        })
    }
    const connection = await Connection.create({ users: [ req.body.from, req.body.to ]})
    if(!connection) {
        return res.status(400).send({
            status: "fail",
            message: "Database error occurred"
        })
    }
    res.status(200).send({ status: "success", connection })
})

app.post("/getApproval", isAuth, async (req, res) => {
    if(!req.user.type !== "STUDENT") {
        return res.status(400).send({
            status: "fail",
            message: `Only students can send approval requests`
        })
    }
    req.body.from = req.user._id
    const required = ["to", "type", "from"]
    for(const key in Object.keys(req.body)) {
        if(!required.includes(key) || !req.body[key].length) {
            return res.status(400).send({
                status: "fail",
                message: `The ${key} is missing in the request`
            })
        }
    }
    if(req.body.type !== "ALUMNI-APPROVAL") {
        return res.status(400).send({
            status: "fail",
            message: `This method is used for creating an alumni approval request`
        })
    }
    const request = await Request.create(req.body)
    if(!request) {
        return res.status(400).send({
            status: "fail",
            message: "Database error occurred"
        })
    }
    res.status(200).send({ status: "success", request })
})

app.post("/rejectApproval", isAuth, async (req, res) => {

})

module.exports = app
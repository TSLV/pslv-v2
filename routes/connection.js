const { Router } = require("express")
const isAuth = require("../middleware/is-auth")
const Request = require("../models/request")
const Connection = require("../models/connection")
const User = require("../models/user")
const student = require("../models/student")
const alumni = require("../models/alumni")
const { Tokenizer } = require("../utils")

const app = Router()

app.post("/create", isAuth,  async (req, res) => {
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
    res.redirect(req.get("referer"))
})

app.post("/acceptRequest", isAuth,  async (req, res) => {
    if(req.body.type !== "MUTUAL") {
        return res.status(400).send({
            status: "fail",
            message: `This method is used for accepting mutual connection requests`
        })
    }
    delete req.body._csrf
    const request = await Request.findOneAndRemove(req.body)
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
    res.redirect(req.get("referer"))
})

app.post("/rejectRequest", isAuth,  async (req, res) => {
    if(req.body.type !== "MUTUAL") {
        return res.status(400).send({
            status: "fail",
            message: `This method is used for accepting mutual connection requests`
        })
    }
    delete req.body._csrf
    const request = await Request.findOneAndRemove(req.body)
    if(!request) {
        return res.status(400).send({
            status: "fail",
            message: "Database error occurred"
        })
    }
    res.redirect(req.get("referer"))
})

app.post("/getApproval", isAuth, async (req, res) => {
    if(!req.user.role !== "STUDENT") {
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

app.post("/acceptApproval", isAuth, async (req, res) => {
    if(!["INSTITUTE", "ADMIN"].includes(req.user.role)) {
        return res.status(400).send({
            status: "fail",
            message: `Only institutes/admins can send approval requests`
        })
    }
    req.body.to = req.user._id
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
            message: `This method is used for accept alumni approval requests`
        })
    }
    const request = await Request.findOneAndDelete(req.body)
    if(!request) {
        return res.status(400).send({
            status: "fail",
            message: "Database error occurred"
        })
    }
    const user = await User.findByIdAndUpdate(req.body.from, { role: "ALUMNI" })
    if(!user) {
        return res.status(400).send({
            status: "fail",
            message: "Database error occurred"
        })
    }
    res.status(200).send({ status: "success", user })
})

app.post("/rejectApproval", isAuth, async (req, res) => {
    if(!["INSTITUTE", "ADMIN"].includes(req.user.role)) {
        return res.status(400).send({
            status: "fail",
            message: `Only institutes/admins can send approval requests`
        })
    }
    req.body.to = req.user._id
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
            message: `This method is used for accept alumni approval requests`
        })
    }
    const request = await Request.findOneAndDelete(req.body)
    if(!request) {
        return res.status(400).send({
            status: "fail",
            message: "Database error occurred"
        })
    }
    res.status(200).send({ status: "success", message: "Successfully rejected the approval request" })
})

app.get("/getRecommendations", isAuth, async (req, res) => {
    const users = []
    users.push(await student.find({ user: {$ne: req.user._id }}).limit(4).exec())
    users.push(await alumni.find({ user: {$ne: req.user._id }}).limit(4).exec())
    res.send(Tokenizer.shuffle(users))
})

module.exports = app
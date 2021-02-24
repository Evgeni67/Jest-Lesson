const router = require("express").Router()
const UserSchema = require("./schema")
const UserModel = require("mongoose").model("User", UserSchema)
const q2m = require("query-to-mongo")
const { authenticate, refreshToken } = require("../auth/tools")
const { authorize } = require("../auth/middleware")

router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password) throw new Error("Provide credentials")
        console.log("first check passed")
        const user = new UserModel({ username, password })
        console.log(process.env.ATLAS_URL)
        const { _id } = await user.save()
        console.log("third check passed")
        res.status(201).send({ _id })

    } catch (error) {
        res.status(400).send({
            message: error.message,
            errorCode: 'wrong_credentials'
        })
    }
})

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password) throw new Error("Provide credentials")

        const user = await UserModel.findOne({ username })
        const tokens = await authenticate(user)
        user.password === password
            ? res.status(200).send(tokens)
            : res.status(400).send({ message: "No username/password match" })

    } catch (error) {
        res.status(400).send({
            message: error.message,
            errorCode: 'wrong_credentials'
        })
    }
})


module.exports = router
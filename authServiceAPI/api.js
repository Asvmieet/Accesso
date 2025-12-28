const express = require('express')
const app = express()
const port = 3000
const authSys = new Map()
const crypto = require("crypto")
app.use(express.json())

app.post("/authSetup/start", (req,res) =>{
    let key = crypto.randomBytes(3).toString("hex").toUpperCase()
    let expire = Date.now() + 2 * 60 * 1000
    let deviceID = req.body.device_id

    authSys.set(key, {
        client: deviceID,
        expires: expire
    }
    )

    res.json({key})

})


app.post("/auth/verify", (req,res) => {

    let device = req.body.device_id
    let key = authSys.get(req.body.key)

    if (!key || key.expires < Date.now() || device != key.client){
        return res.status(401).json({ok: false})
    }

    authSys.delete(req.body.key)
    res.json({ok: true}) 
    




})



app.listen(port, ()=>{
    console.log("API Running");
})
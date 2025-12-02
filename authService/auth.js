const keytar = require("keytar")
const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const fs = require("fs")

async function sSession() {
    

const token = crypto.randomBytes(32).toString("hex");
const expire = Date.now() + 3600000

const sData = JSON.stringify({
    token,
    expire
});

await keytar.setPassword("accessoAuth","myAccessoLocal", sData);

console.log("Saved to keychain")
}


async function loadS() {
    const sData = await keytar.getPassword("accessoAuth", "myAccessoLocal");

    if (!sData) return null;

    const localSession = JSON.parse(sData)

    if (Date.now() > localSession.expire){ 
        await keytar.deletePassword("accessoAuth", "myAccessoLocal");
        console.log("Expired, Deleted Local Auth")
        return null;
    }
    return sData

    console.log(sData);

}

async function logOut() {
    await keytar.deletePassword("accessoAuth", "myAccessoLocal");
    console.log("Logged out")
}

async function isLoggedIn() {
    const sData = await keytar.getPassword("accessoAuth", "myAccessoLocal");

    if (!sData) return null;

    const localSession = JSON.parse(sData)

    if (Date.now() > localSession.expire){ 
        await keytar.deletePassword("accessoAuth", "myAccessoLocal");
        console.log("Expired, Deleted Local Auth")
        return null;
    }
    console.log(sData);

    return localSession !== null;

}

const path = require("path").join(__dirname, "authService/localAuth.json")

let rData = fs.readFileSync(path, "utf8")

let data = JSON.parse(rData)


async function webStart(user,password) {

let data2 = await data;

    if (await bcrypt.compare(user,data2.username) && await bcrypt.compare(password,data2.authKey)){
        loadS()
        sSession()
        return true;
    } else {
        return false;
    }

}


async function checkL2() {
    const sData = await keytar.getPassword("accessoAuth", "myAccessoLocal");

    if (!sData) return false;

    const localSession = JSON.parse(sData)

    if (Date.now() > localSession.expire){ 
        await keytar.deletePassword("accessoAuth", "myAccessoLocal");
        console.log("Expired, Deleted Local Auth")
        return null;
    }
    console.log(sData);
    console.log(localSession);
    return true;


}

async function key(authKey, username) {
    const salt = await bcrypt.genSalt(10)
    data.authKey = await bcrypt.hash(authKey,salt)
    data.username = await bcrypt.hash(username,salt)

    if (await bcrypt.compare(process.argv[5],data.authKey)){

    fs.writeFileSync(path, JSON.stringify(data,null,2), "utf8");

    }
}
// termRun

(async () => {




const args = process.argv[2]
const authKey = process.argv[3]
const username = process.argv[4]

// console.log(authKey)

if (!args){
    console.log("Missing arugments: run the command with args: command authKey")
return null;
}



if (args == "key" && authKey){
    const salt = await bcrypt.genSalt(10)
    data.authKey = await bcrypt.hash(authKey,salt)
    data.username = await bcrypt.hash(username,salt)

    if (await bcrypt.compare(process.argv[5],data.authKey)){

    fs.writeFileSync(path, JSON.stringify(data,null,2), "utf8");

    }
}

if (args == "start" && await bcrypt.compare(authKey,data.authKey)){
    sSession()
} else if(args == "load" && await bcrypt.compare(authKey,data.authKey)){
    loadS()
}else if(args == "logout" && await bcrypt.compare(authKey,data.authKey)){
logOut()
}else if(args == "status"){
    isLoggedIn();
}

})();
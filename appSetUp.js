const {app, BrowserWindow} = require("electron")
const path = require("path")

let mainWindow;

app.on(`ready`, () => {
mainWindow = new BrowserWindow({
    width: 350,
    height: 400,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
    }

});
mainWindow.loadFile(path.join(__dirname,'index.html'));
})
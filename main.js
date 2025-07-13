const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const puppeteerLauncher = require('./puppeteerLauncher');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('launch-browser', async (event, profileName) => {
  await puppeteerLauncher(profileName);
});

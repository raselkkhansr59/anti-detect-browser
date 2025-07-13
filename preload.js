const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  launchBrowser: (profileName) => ipcRenderer.send('launch-browser', profileName)
});

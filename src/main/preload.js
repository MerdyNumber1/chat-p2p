const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send(...args) {
      ipcRenderer.send(...args);
    },
    sendSync(...args) {
      ipcRenderer.sendSync(...args);
    },
    on(channel, func) {
      ipcRenderer.on(channel, func);
    },
    once(channel, func) {
      ipcRenderer.once(channel, func);
    },
    removeListener(channel) {
      ipcRenderer.removeAllListeners(channel);
    },
  },
});

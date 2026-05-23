const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('chrysalisVault', {
  getManifest: () => ipcRenderer.invoke('vault:get-manifest'),
  launchSimulation: (id) => ipcRenderer.invoke('vault:launch-simulation', id),
  returnToMenu: () => ipcRenderer.invoke('vault:return-to-menu')
});

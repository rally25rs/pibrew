const { app, BrowserWindow } = require('electron');

const createWindow = (config) => {
  const win = new BrowserWindow({
    fullscreen: true,
  })

  win.loadURL(`http://localhost:${config.web.port}`);
};

module.exports = {
  start: (config, onQuit) => {
    app.whenReady().then(() => {
      createWindow(config);
    });

    app.on('window-all-closed', () => {
      onQuit();
    });
  },

  stop: () => {
    app.quit();
  }
};

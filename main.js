const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,  // important pour Next.js
      contextIsolation: true,
    }
  });
  // Charger la version exportée de Next.js
  mainWindow.loadFile(path.join(__dirname, 'out', 'index.html'));

  mainWindow.on('closed', () => mainWindow = null);
}
  // Si tu es en dev
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    // En production, charger la build Next.js
    mainWindow.loadFile(path.join(__dirname, '.next/server/pages/index.html'));
    // ⚠️ Next.js n’a pas vraiment de index.html, voir plus bas
  }

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

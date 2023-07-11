import { app, BrowserWindow, ipcMain, IpcMainEvent } from "electron";
import path from "node:path";
import fs from "node:fs";

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, "../dist");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.webContents.openDevTools({
    mode: "detach",
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }
}

app.on("window-all-closed", () => {
  win = null;
});

// add event to load config on frontend
ipcMain.on("load-config", (event) => {
  const configPath = path.join(process.env.DIST, "config.json");
  fs.readFile(configPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    event.reply("config-loaded", data);
  });
});

ipcMain.on("message", (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send("message", "hi from electron"), 500);
});

app.whenReady().then(() => {
  createWindow();
});

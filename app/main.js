const { app, BrowserWindow, ipcMain, Menu } = require('electron');
let mainWindow;

// Main app menu
const name = app.getName();
const webviewId = 'appearin_webview';
const appWebsite = 'https://github.com/vitorgalvao/appear.in/';
const template = [
  {
    label: 'Application',
    submenu: [
      { label: 'About ' + name, role: 'about' },
      { type: 'separator' },
      { label: 'Hide ' + name, accelerator: 'Command+H', role: 'hide' },
      { label: 'Hide Others', accelerator: 'Command+Shift+H', role: 'hideothers' },
      { type: 'separator' },
      { label: 'Quit', accelerator: 'Command+Q', click: function () { app.quit(); } }
    ]
  }, {
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'Command+Z', role: 'undo' },
      { label: 'Redo', accelerator: 'Shift+Command+Z', role: 'redo' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'Command+X', role: 'cut' },
      { label: 'Copy', accelerator: 'Command+C', role: 'copy' },
      { label: 'Paste', accelerator: 'Command+V', role: 'paste' },
      { label: 'Select All', accelerator: 'Command+A', role: 'selectall' }
    ]
  }, {
    label: 'View',
    submenu: [
      { label: 'Reload', accelerator: 'Command+R', click: function (item, focusedWindow) { if (focusedWindow) focusedWindow.webContents.executeJavaScript('document.getElementById("' + webviewId + '").reload();'); } }
    ]
  }, {
    label: 'Window',
    role: 'window',
    submenu: [
      { label: 'Minimize', accelerator: 'Command+M', role: 'minimize' },
      { label: 'Close', accelerator: 'Command+W', role: 'close' }
    ]
  }, {
    label: 'Help',
    role: 'help',
    submenu: [
      { label: 'View Website', click: function () { require('electron').shell.openExternal(appWebsite) } },
      { type: 'separator' },
      { label: 'Toggle Developer Tools', click: function (item, focusedWindow) { if (focusedWindow) focusedWindow.toggleDevTools(); } }
    ]
  }
];

// Setting app notifications.
ipcMain.on('unread', function (event, args) {
  let unreadMessages;

  if (args === '0') {
    unreadMessages = '•';
  } else {
    unreadMessages = args;
  }

  if (!mainWindow.isFocused()) {
    app.dock.bounce();
    app.dock.setBadge(unreadMessages);
  }
});

app.on('browser-window-focus', function () {
  app.dock.setBadge('');
});

app.on('ready', function () {
  mainWindow = new BrowserWindow({ width: 1000, height: 540, titleBarStyle: 'hidden-inset' });
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Set menu
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  // Prevent app from exiting (hide it instead) when window is closed (i.e. when we press the red close button).
  mainWindow.on('close', function (event) {
    event.preventDefault();
    mainWindow.hide();
    app.focus();
  });
  app.on('before-quit', function () { app.exit(0); });
  app.on('activate', function () { mainWindow.show(); });
});

const { app, BrowserWindow, ipcMain, protocol, net } = require('electron');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'vault',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true
    }
  }
]);

const APP_ROOT = path.resolve(__dirname, '..');
const APP_DIR = path.join(APP_ROOT, 'app');
const VAULT_DIR = path.join(APP_ROOT, 'vault');
const MANIFEST_PATH = path.join(VAULT_DIR, 'manifest.json');

let mainWindow = null;
let activeView = 'menu';

function resolveVaultRequest(requestUrl) {
  const url = new URL(requestUrl);
  const host = url.hostname;
  const base = host === 'app' ? APP_DIR : VAULT_DIR;
  const pathname = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
  const target = path.normalize(path.join(base, pathname));
  const relative = path.relative(base, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Forbidden path traversal attempt.');
  }
  return target;
}

function registerVaultProtocol() {
  protocol.handle('vault', async (request) => {
    try {
      const target = resolveVaultRequest(request.url);
      if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
        return new Response('Not found', { status: 404 });
      }
      return net.fetch(pathToFileURL(target).toString());
    } catch (error) {
      return new Response(error.message, { status: 403 });
    }
  });
}

function readManifest() {
  const parsed = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  parsed.simulations = (parsed.simulations || []).filter((sim) => sim.included !== false);
  return parsed;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: '#080a12',
    title: 'Chrysalis Simulation Vault',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: true,
      devTools: !app.isPackaged
    }
  });

  mainWindow.removeMenu();

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('vault://')) event.preventDefault();
  });
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.key === 'Escape' && activeView === 'simulation') {
      event.preventDefault();
      loadMenu();
    }
  });

  loadMenu();
}

function loadMenu() {
  activeView = 'menu';
  return mainWindow.loadURL('vault://app/index.html');
}

async function injectBackOverlay() {
  if (!mainWindow || activeView !== 'simulation') return;
  const js = `(() => {
    if (document.getElementById('chrysalis-vault-back')) return;
    const button = document.createElement('button');
    button.id = 'chrysalis-vault-back';
    button.textContent = '← Vault Menu';
    button.style.cssText = 'position:fixed;top:14px;right:14px;z-index:2147483647;border:1px solid rgba(255,255,255,.24);border-radius:999px;background:rgba(8,10,18,.76);color:#fff;padding:9px 14px;font:600 13px system-ui,-apple-system,Segoe UI,sans-serif;backdrop-filter:blur(10px);box-shadow:0 10px 28px rgba(0,0,0,.35);cursor:pointer;';
    button.addEventListener('click', () => window.chrysalisVault.returnToMenu());
    document.body.appendChild(button);
  })();`;
  await mainWindow.webContents.executeJavaScript(js).catch(() => undefined);
}

ipcMain.handle('vault:get-manifest', () => readManifest());

ipcMain.handle('vault:launch-simulation', async (_event, id) => {
  const manifest = readManifest();
  const sim = manifest.simulations.find((entry) => entry.id === id);
  if (!sim) throw new Error(`Unknown simulation id: ${id}`);
  activeView = 'simulation';
  await mainWindow.loadURL(`vault://vault/sims/${encodeURIComponent(sim.file)}`);
  await injectBackOverlay();
  return true;
});

ipcMain.handle('vault:return-to-menu', async () => {
  await loadMenu();
  return true;
});

app.whenReady().then(() => {
  registerVaultProtocol();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.HUSTLINGO_DEMO_PORT || 8081);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('HUSTLINGO_DEMO_PORT phải là một cổng từ 1 đến 65535.');
}
const url = `http://localhost:${port}/demo-phone.html`;
const windowsChrome = '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe';

function openPresentation() {
  let command;
  let args;
  if (existsSync(windowsChrome)) {
    command = windowsChrome;
    args = [`--app=${url}`, '--start-maximized'];
  } else if (process.platform === 'win32') {
    command = 'powershell.exe';
    args = ['-NoProfile', '-NonInteractive', '-Command', 'Start-Process', url];
  } else {
    command = process.platform === 'darwin' ? 'open' : 'xdg-open';
    args = [url];
  }
  const browser = spawn(command, args, { detached: true, stdio: 'ignore' });
  browser.on('error', () => console.log(`Mở màn trình chiếu tại ${url}`));
  browser.unref();
}

async function isPresentationReady() {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1500) });
    return response.ok && (await response.text()).includes('data-hustlingo-presentation');
  } catch {
    return false;
  }
}

console.log(`\nTrình chiếu HustLingo: ${url}\n`);
if (await isPresentationReady()) {
  openPresentation();
} else {
  const expo = spawn(process.execPath, [join(root, 'node_modules/expo/bin/cli'), 'start', '--web', '--port', String(port), '--max-workers', '2'], {
    cwd: root,
    env: { ...process.env, BROWSER: 'none', EXPO_NO_TELEMETRY: '1' },
    stdio: 'inherit',
  });
  let checking = false;
  const timer = setInterval(async () => {
    if (checking) return;
    checking = true;
    if (await isPresentationReady()) {
      clearInterval(timer);
      openPresentation();
    }
    checking = false;
  }, 1000);
  expo.on('error', error => {
    clearInterval(timer);
    console.error(error.message);
    process.exitCode = 1;
  });
  expo.on('exit', code => {
    clearInterval(timer);
    process.exitCode = code ?? 0;
  });
  process.on('SIGINT', () => expo.kill('SIGINT'));
  process.on('SIGTERM', () => expo.kill('SIGTERM'));
}

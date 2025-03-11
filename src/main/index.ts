import Store from 'electron-store'
import log4js from 'log4js'
import windowStateKeeper from 'electron-window-state'

import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import packageInfo from '../../package.json' with { type: 'json' }
import ipcMainHandler from './function/ipc'

const isPrimary = app.requestSingleInstanceLock()
const logger = log4js.getLogger('background')
const isDevelopment = process.env.NODE_ENV !== 'production'

export let logLevel = isDevelopment ? 'debug' : 'info'
export let win = undefined as BrowserWindow | undefined

function createWindow(): void {
    const store = new Store() as any
    if(store.get('opt_log_level')) {
        logLevel = (store.get('opt_log_level') ?? 'info') as string
    }
    logger.level = logLevel

    /* eslint-disable no-console */
    console.log('')
    console.log(' _____ _____ _____ _____ __ __  \n' +
                '|   __|_   _|  _  |  _  |  |  | \n' +
                '|__   | | | |     |   __|-   -| \n' +
                '|_____| |_| |__|__|__|  |__|__| CopyRight © Stapx Steve')
    console.log('=======================================================')
    console.log('日志等级:', logLevel)
    /* eslint-enable no-console */
    logger.info('欢迎使用 Stapxs QQ Lite, 当前版本: ' + packageInfo.version)

    logger.info('启动平台架构：' + process.platform)
    logger.info('正在创建窗体 ……')

    const mainWindowState = windowStateKeeper({
        defaultWidth: 850,
        defaultHeight: 530
    })

    let windowConfig = {
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        // icon: join(__dirname, '../assets/icons/icon.png'),
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: join(__dirname, '../preload/index.mjs'),
            sandbox: false
        },
        maximizable: false,
        fullscreenable: false,
    } as Electron.BrowserWindowConstructorOptions
    // 平台补充配置
    if(process.platform === 'darwin') {
        // MacOS
        windowConfig = {
            ...windowConfig,
            titleBarStyle: 'hidden',
            trafficLightPosition: { x: 11, y: 10 },
            vibrancy: 'fullscreen-ui',
            transparent: true,
            visualEffectState: 'followWindow'
        }
    } else if(process.platform === 'win32') {
        // Windows
        windowConfig = {
            ...windowConfig,
            backgroundColor: '#00000000',
            backgroundMaterial: 'acrylic',
            frame: false
        }
    } else if (process.platform === 'linux') {
        // Linux
        windowConfig = {
            ...windowConfig,
            transparent: true,
            frame: false
        }
    }
    // 创建窗体
    win = new BrowserWindow(windowConfig)
    mainWindowState.manage(win)
    win.on('ready-to-show', () => {
        if(win) win.show()
    })

    win.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        win.loadURL(process.env['ELECTRON_RENDERER_URL'])
        win.webContents.openDevTools()
    } else {
        win.loadURL('app://./index.html')
    }
}

app.whenReady().then(() => {
    // 单例模式
    if (!isPrimary) {
        app.quit()
        return
    }
    electronApp.setAppUserModelId('cn.stapxs.toolbox')

    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    // 注册所有 IPC 事件
    ipcMainHandler()
    // 创建窗体
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    app.quit()
})

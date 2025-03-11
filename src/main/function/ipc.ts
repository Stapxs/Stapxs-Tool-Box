import log4js from 'log4js'

import { ipcMain } from 'electron'
import { logLevel } from '..'

const logger = log4js.getLogger('ipc')

export default function ipcMainHandler() {
    ipcMain.on('ping', () => {
        logger.level = logLevel
        logger.info('pong')
    })
}

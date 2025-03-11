<script setup lang="ts">
import * as App from './function/util/appUtil'
import * as Option from './function/option'
import Spacing from 'spacingjs/src/spacing'
import Umami from '@stapxs/umami-logger-typescript'

import { onMounted } from 'vue'
import { Logger, runtimeData } from './function/base'

const dev = import.meta.env.DEV
const logger = new Logger()

onMounted(() => {
    window.onload = () => {
        if(!window.electron) {
            window.location.href = 'about:blank'
        }
        runtimeData.reader = window.electron.ipcRenderer
        // 初始化功能 ================================================
        App.createIpc()
        // 加载开发者相关功能
        if (dev) {
            document.title = 'Stapxs Tool Box (Dev)'
            // 布局检查工具
            Spacing.start()
        }
        // 加载设置项
        runtimeData.config = Option.load()
        //TODO: 加载主题
        // 初始化完成
        logger.info('欢迎使用 Stapxs Tool Box！')
        logger.info('当前启动模式为: ' + dev ? 'development' : 'production')
        // 初始化额外功能 =============================================
        // UM：加载 Umami 统计功能
        if (!Option.get('close_ga') && !dev) {
            // 给页面添加一个来源域名方便在 electron 中获取
            const config = {
                baseUrl: import.meta.env.VITE_APP_MU_ADDRESS,
                websiteId: import.meta.env.VITE_APP_MU_ID,
                hostName: 'electron.stapxs.cn'
            } as any
            Umami.initialize(config)
        } else if (dev) {
            logger.debug('由于运行在调试模式下，分析组件并未初始化 ……')
        } else if (Option.get('close_ga')) {
            logger.debug('统计功能已被关闭，分析组件并未初始化 ……')
        }
        // TODO: 检查更新
    }
})
</script>

<template>
    <div id="main">
        <div id="controller" class="controller" />
    </div>
</template>

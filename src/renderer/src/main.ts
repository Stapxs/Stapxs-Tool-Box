import { createApp } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

import packageInfo from '../../../package.json'
import App from './App.vue'
import './assets/base.css'

const app = createApp(App)
library.add(fas)
app.component('FontAwesomeIcon', FontAwesomeIcon)

app.mount('#app')

export default app
export const uptime = new Date().getTime()

const colorList = [
    '50534f',
    'f9a633',
    '8076a3',
    'f0a1a8',
    '92aa8a',
    '606E7A',
    '7abb7e',
    'b573f7',
    'ff5370',
    '99b3db',
    '677480',
]
const color = colorList[Math.floor(Math.random() * colorList.length)]
// eslint-disable-next-line no-console
console.log(
    `%cWELCOME%c Stapxs Tool Box - ${packageInfo.version} ( ${import.meta.env.DEV ? 'development' : 'production'} ) `,
    `font-weight:bold;background:#${color};color:#fff;border-radius:7px 0 0 7px;padding:7px 14px;margin:7px 0 7px 7px;`,
    'background:#e3e8ec;color:#000;border-radius:0 7px 7px 0;display:inline-block;padding:7px 14px;margin:7px 7px 7px 0;',
)

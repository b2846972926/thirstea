import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { LoadingPlugin } from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import App from './App.vue'
import router from './router'
import { currency, date } from './methods/filters'
import $httpMessageState from './methods/pushMessageState'

import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import * as AllRules from '@vee-validate/rules'
import { localize, setLocale } from '@vee-validate/i18n'
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'
const app = createApp(App)

app.config.globalProperties.$filters = {
  currency,
  date,
}

Object.entries(AllRules).forEach(([ruleName, ruleFn]) => {
  if (typeof ruleFn === 'function') {
    defineRule(ruleName, ruleFn)
  }
})

// 設定語言為中文
configure({
  generateMessage: localize({ zh_TW: zhTW }),
  validateOnInput: true, // 即時驗證
})
setLocale('zh_TW')

// 註冊 Vee-Validate 的元件
app.component('AppForm', Form)
app.component('AppField', Field)
app.component('ErrorMessage', ErrorMessage)

app.config.globalProperties.$httpMessageState = $httpMessageState
app.use(LoadingPlugin)
app.use(createPinia())
app.use(router)

app.mount('#app')

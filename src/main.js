import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from "@/router"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from "axios";

const app=createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [function (data) {
    let src = ''
    for (let item in data) {
        src += encodeURIComponent(item) + '=' + encodeURIComponent(data[item]) + '&'
    }
    return src
}]
app.use(ElementPlus)
app.use(router)
app.mount('#app')

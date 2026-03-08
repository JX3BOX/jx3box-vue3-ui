// 1.Create APP
import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App);

// 2.Components
import { createHead } from "@vueuse/head";
const head = createHead();
app.use(head);

// element-plus
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
// import "../assets/css/var.less";

import "@jx3box/jx3box-common/css/normalize.css";

import reporter from "@jx3box/jx3box-common/js/reporter";

app.use(ElementPlus, {
    locale: zhCn,
});

import * as ElementPlusIconsVue from "@element-plus/icons-vue";

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

import { install } from "../index.js";
install(app);

reporter.installVue3(app);

// 3.Mount DOM
app.mount("#app");

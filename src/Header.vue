<template>
    <header class="c-header" id="c-header" :class="{ isOverlay: overlayEnable && isOverlay }" v-if="!isApp">
        <div class="c-header-inner">
            <!-- logo -->
            <header-logo />

            <!-- origin -->
            <clientSwitch :defaultValue="client" />

            <!-- game -->
            <!-- <gameSwitch /> -->

            <!-- search -->
            <header-search :client="client" />

            <!-- nav -->
            <header-nav :client="client" />

            <slot></slot>

            <!-- user -->
            <header-user :client="client" />
        </div>
        <Box class="c-header-jx3box" :overlayEnable="overlayEnable" :client="client" />
    </header>
</template>

<script>
import _ from "lodash";
import { isApp, KW } from "../assets/js/app.js";

// components
import logo from "./header/Logo.vue";
import clientSwitch from "./header/ClientSwitch.vue";
import search from "./header/Search.vue";
import nav from "./header/Nav.vue";
import user from "./header/User.vue";
import Box from "../src/Box.vue";
import { isMiniProgram, miniprogramHack } from "@jx3box/jx3box-common/js/utils";
import miniprogram from "@jx3box/jx3box-common/data/miniprogram.json";

export default {
    name: "CommonHeader",
    props: ["overlayEnable"],
    data: function () {
        return {
            isOverlay: false,
            isApp: isApp(),
        };
    },
    computed: {
        client: function () {
            return location.hostname.includes("origin") ? "origin" : "std";
        },
    },
    methods: {
        // webView检测
        checkIsWebView: function () {
            if (window.navigator.userAgent.includes(KW)) {
                document.documentElement.classList.add("env-app");
            }

            if (isMiniProgram()) {
                const urlParams = new URLSearchParams(window.location.search);
                const appid = urlParams.get("appid");
                const item = miniprogram?.find((item) => item.appid === appid);

                document.documentElement.classList.add("v-miniprogram");

                if (appid && item) {
                    document.documentElement.classList.add("env-miniprogram" + item.id);

                    window.JX3BOX_ENV = item.id?.toUpperCase() + "_MINIPROGRAM";
                } else {
                    document.documentElement.classList.add("wechat-miniprogram");

                    window.JX3BOX_ENV = "MINIPROGRAM";

                    // 微信小程序hack
                    miniprogramHack();
                }
            }
        },

        // 检查
        init: function () {
            this.checkIsWebView();
        },
    },
    created: function () {
        this.init();

        if (this.overlayEnable) {
            const vm = this;
            window.addEventListener(
                "scroll",
                _.throttle(() => {
                    vm.isOverlay = window.scrollY > 200 ? true : false;
                }, 200)
            );
        }
    },
    mounted: function () {},
    components: {
        "header-logo": logo,
        "header-search": search,
        "header-nav": nav,
        "header-user": user,
        Box,
        clientSwitch,
        // gameSwitch,
    },
};
</script>

<style lang="less">
@import "../assets/css/header.less";
</style>

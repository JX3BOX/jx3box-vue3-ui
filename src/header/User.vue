<template>
    <div class="c-header-user" id="c-header-user">
        <template v-if="isLogin">
            <!-- 消息中心 -->
            <message />

            <!-- 创作中心 -->
            <publish />

            <!-- vip -->
            <vip />

            <!-- 商城 -->
            <shop />

            <!-- 我的资产 -->
            <asset :asset="asset" />

            <!-- manage -->
            <manage :isTeammate="isTeammate" v-if="isTeammate" />

            <!-- user info -->
            <user-info :asset="asset" @logout="logout" @update="update" />
        </template>
        <template v-else>
            <div class="c-header-login">
                <a class="u-register u-default" :href="register_url">注册</a>
                <em>|</em>
                <a class="u-login u-default" :href="login_url">登录</a>
            </div>
        </template>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { userSignIn } from "../../service/author";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
dayjs.extend(isToday);

import message from "./Message.vue";
import publish from "./Publish.vue";
import vip from "./Vip.vue";
import asset from "./Asset.vue";
import manage from "./Manage.vue";
import userInfo from "./UserInfo.vue"; 
import shop from "./Shop.vue";
export default {
    name: "HeaderUser",
    components: {
        message,
        publish,
        vip,
        asset,
        manage,
        userInfo, 
        shop,
    },
    data: function () {
        return {
            // 是否折叠
            // 登录信息
            user: User.getInfo(),
            isLogin: User.isLogin(),

            // VIP
            asset: {
                expire_date: "2022-03-07T00:00:00+08:00",
                total_day: 395,
                was_vip: 0,

                pro_expire_date: "2022-03-07T00:00:00+08:00",
                pro_total_day: 366,
                was_pro: 0,
            },

            // 链接
            login_url: JX3BOX.__Links.account.login + "?redirect=" + location.href,
            register_url: JX3BOX.__Links.account.register + "?redirect=" + location.href,

            isTeammate: false,
        };
    },
    methods: {
        // 签到
        signIn: function () {
            try {
                let user_last_login = localStorage.getItem("user_last_login");
                user_last_login = (user_last_login && JSON.parse(user_last_login)) || "";

                if (user_last_login && dayjs(user_last_login).isToday()) {
                    // console.log("已签到");
                } else {
                    // 延迟2秒执行 feedback#501
                    const signTimer = setTimeout(() => {
                        userSignIn()
                            .then(() => {
                                let msg = this.$message({
                                    type: "success",
                                    message: "签到成功",
                                    customClass: "c-header-signin",
                                    duration: 0,
                                });
                                // 模拟手动关闭
                                setTimeout(() => {
                                    msg.close();
                                }, 3000);
                                localStorage.setItem("user_last_login", JSON.stringify(dayjs()));
                            })
                            .catch(() => {
                                localStorage.setItem("user_last_login", JSON.stringify(dayjs()));
                                console.log(dayjs.tz.guess());
                            })
                            .finally(() => {
                                clearTimeout(signTimer);
                            });
                    }, 2000);
                }
            } catch (e) {
                console.log(e);
            }
        },
        // 资产
        loadAsset: function () {
            User.getAsset().then((data) => {
                this.asset = data;
            });
        },
        // 初始化
        init: function () {
            if (this.isLogin) {
                this.loadAsset();
                this.signIn();
            }
        },

        // 退出登录
        logout: function () {
            this.isLogin = false;
        },

        update: function ({ is_teammate }) {
            this.isTeammate = is_teammate;
        },
    },
    created: function () {
        this.init();
    },
};
</script>

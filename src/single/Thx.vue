<template>
    <div class="w-thx">
        <div class="w-thx-panel">
            <boxcoin-admin
                :postId="postId"
                :postType="postType"
                v-if="hasRight && adminBoxcoinEnable && boxcoin_enable"
                :userId="userId"
                :max="admin_max"
                :min="admin_min"
                :own="admin_left"
                :total="admin_total"
                :points="admin_points"
                :authors="authors"
                @updateRecord="updateRecord"
                :client="finalClient"
            />
            <Like :postId="postId" :postType="postType"></Like>
            <fav :postId="postId" :postType="postType" :postTitle="postTitle"></fav>
            <Rss v-if="showRss" :type="postType" :id="postId" :title="postTitle"></Rss>
            <boxcoin-user
                :postId="postId"
                :postType="postType"
                :boxcoin="boxcoin"
                :userId="userId"
                :own="user_left"
                :points="user_points"
                :authors="authors"
                v-if="userBoxcoinEnable && boxcoin_enable && allowGift"
                @updateRecord="updateRecord"
                :client="finalClient"
            />
            <Share :postId="postId" :postType="postType" :client="client" />
            <watch-later :category="postType" :title="postTitle" :author-id="authorId" :banner="banner" :content-id="contentMetaId"></watch-later>
        </div>
        <div class="w-thx-records">
            <boxcoin-records :postId="postId" :postType="postType" :postClient="finalClient" :cacheRecord="cacheRecord"
                :mode="mode" @update:boxcoin="updateBoxcoin" />
        </div>
        <div class="w-thx-copyright">
            &copy;
            所有原创作品，著作权归作者所有，所有未经授权的非署名转载或抄袭将有权追究法律责任，所有法律事务由专聘律师代理。<br />
            签约作者独家特约稿件，及所有魔盒官方评分作品用户一经兑现则视为有偿付费稿件，所有商业稿件的转载引用需同时征得魔盒平台授权。
        </div>
</div>
</template>

<script>
import Like from "../interact/Like.vue";
import Fav from "../interact/Fav.vue";
import BoxcoinAdmin from "../interact/BoxcoinAdmin.vue";
import BoxcoinUser from "../interact/BoxcoinUser.vue";
import BoxcoinRecords from "../interact/BoxcoinRecords.vue";
import Share from "../interact/Share.vue";
import WatchLater from "../interact/WatchLater.vue";
import Rss from "../interact/Rss.vue";

import User from "@jx3box/jx3box-common/js/user";
import { getBoxcoinStatus, getPostBoxcoinConfig } from "../../service/thx";

export default {
    name: "ThxComp",
    components: {
        Like,
        Fav,
        BoxcoinAdmin,
        BoxcoinUser,
        BoxcoinRecords,
        Share,
        WatchLater,
        Rss,
    },
    props: {
        type: {
            type: String,
            default: "normal",
        },
        postId: {
            type: Number,
            default: 0,
        },
        postType: {
            type: String,
            default: "",
        },
        postTitle: {
            type: String,
            default: "",
        },
        userId: {
            type: Number,
            default: 0,
        },
        authors: {
            type: Array,
            default: () => [],
        },
        mode: {
            type: String,
            default: "normal",
        },
        client: {
            type: String,
            default: "std",
        },
        allowGift: {
            type: [Number, Boolean],
            default: 1,
        },
        adminBoxcoinEnable: {
            type: Boolean,
            default: false,
        },
        userBoxcoinEnable: {
            type: Boolean,
            default: false,
        },
        showRss: {
            type: Boolean,
            default: false,
        },
        authorId: {
            type: Number,
            default: 0,
        },
        banner: {
            type: String,
            default: "",
        },
        contentMetaId: {
            type: Number,
            default: 0,
        }
    },
    data: function () {
        return {
            boxcoin: 0,
            hasRight: User.getInfo().group >= 32,
            user: User.getInfo(),

            admin_max: 0,
            admin_min: 0,
            admin_left: 0,
            admin_total: 0,
            admin_points: [100],

            user_left: 0,
            user_points: [100],

            cacheRecord: null,
            boxcoin_enable: 0,

            showDrawer: false,
        };
    },
    computed: {
        post_keys: function () {
            return [this.postId, this.postType];
        },
        finalClient: function() {
            if (this.client == 'wujie') {
                return "std"
            }
            return this.client
        }
    },
    watch: {
        post_keys: {
            immediate: true,
            deep: true,
            handler: function () {
                this.postType && this.postId && this.loadBoxcoinConfig();
            },
        },
    },
    methods: {
        loadBoxcoinConfig: function () {
            User.isLogin() &&
                getPostBoxcoinConfig(this.postType).then((res) => {
                    this.admin_max = res.data.data.limit.admin_max || 0;
                    this.admin_min = res.data.data.limit.admin_min || 0;
                    this.admin_points = res.data.data.limit.admin_points || [10, 1000];
                    this.admin_left = res.data.data.asManagerBoxCoinRemain || 0;
                    this.admin_total = res.data.data.asManagerBoxCoinTotal || 0;

                    this.user_points = res.data.data.limit.user_points || [10, 1000];
                    // 根据多端展示剩余币
                    // 作品是n端，接受n端币+all币
                    if (this.finalClient == "origin") {
                        this.user_left = res.data.data.asUserBoxCoinRemainOrigin + res.data.data.asUserBoxCoinRemainAll;
                    } else if (this.finalClient == "std") {
                        this.user_left = res.data.data.asUserBoxCoinRemainStd + res.data.data.asUserBoxCoinRemainAll;
                    } else {
                        this.user_left =
                            res.data.data.asUserBoxCoinRemainAll +
                            res.data.data.asUserBoxCoinRemainStd +
                            res.data.data.asUserBoxCoinRemainOrigin;
                    }
                });
            getBoxcoinStatus().then((res) => {
                this.boxcoin_enable = !!~~res.data?.data?.val;
            });
        },
        // 用户打赏
        updateRecord: function (data) {
            this.cacheRecord = data;
        },
        updateBoxcoin: function (data) {
            this.boxcoin = data;
        },
    },
};
</script>

<style lang="less">
@import "../../assets/css/thx.less";
</style>

<template>
    <div class="w-like2" :class="{ disabled: !status }" @click="addLike" v-if="ready">
        <el-tooltip effect="dark" content="点赞" placement="top-start">
            <div>
                <img class="u-icon" svg-inline :src="iconPath" />
                <span class="u-count" v-if="count">{{ count }}</span>
            </div>
        </el-tooltip>
    </div>
</template>

<script>
import { postStat, getStat } from "@jx3box/jx3box-common/js/stat_v2";
import JX3BOX  from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "LikeComp",
    props: ["postType", "postId"],
    data: function () {
        return {
            status: true,
            count: 0,
        };
    },
    computed: {
        ready() {
            return this.postType && this.postId;
        },
        iconPath() {
            return JX3BOX.__cdn + "design/vector/icon/like.svg"
        },
    },
    methods: {
        init: function () {
            this.loadStat();
        },
        loadStat: function () {
            getStat(this.postType, this.postId).then((res) => {
                this.count = res.data.likes || 0;
            });
        },
        // 点赞
        addLike: function () {
            if (!this.ready) return;
            this.count++;
            if (this.status) {
                postStat(this.postType, this.postId, "likes");
            }
            this.status = false;
        },
    },
    watch: {
        postId: function () {
            this.init();
        },
    },
};
</script>

<style lang="less">
@import "../../assets/css/like2.less";
</style>

<template>
    <div class="w-fav2" :class="{ disabled: favorite }" @click="doFav">
        <el-tooltip effect="dark" :content="favContent" placement="top-start">
            <div class="w-fav2_content">
                <img v-if="favorite" class="u-icon" svg-inline :src="unstarIcon" />
                <img v-else class="u-icon" svg-inline :src="starIcon" />
                <span class="u-count" v-if="!hiddenNum && total">{{ total }}</span>
            </div>
        </el-tooltip>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { hasFav, addFav, delFav } from "../../service/fav";
import JX3BOX  from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "FavoriteComp",
    props: ["postType", "postId", "postTitle", "hiddenNum", "isOld"],
    data: function () {
        return {
            login: User.isLogin(),
            favorite: false,
            total: 0,
        };
    },
    computed: {
        favContent() {
            return this.favorite ? "已收藏" : "收藏";
        },
        starIcon() {
            return this.isOld ? require("../../assets/img/widget/star.svg") : JX3BOX.__cdn + "design/vector/icon/collect.svg"
        },
        unstarIcon() {
            return this.isOld ? require("../../assets/img/widget/unstar.svg") : JX3BOX.__cdn + "design/vector/icon/uncollect.svg"
        },
    },
    methods: {
        doFav: function () {
            if (this.login) {
                this.favorite ? this.delFav() : this.addFav();
            } else {
                User.toLogin();
            }
        },
        hasFav: function () {
            hasFav(this.postType, this.postId).then((res) => {
                this.favorite = res.id || false;
                this.total = res.totalFavorites || 0;
            });
        },
        addFav: function () {
            addFav(this.postType, this.postId, this.postTitle).then((res) => {
                this.favorite = res.id;
                this.total++;
            });
        },
        delFav: function () {
            delFav(this.favorite).then(() => {
                this.favorite = false;
                this.total && this.total--;
            });
        },
    },
    watch: {
        postId: {
            immediate: true,
            handler() {
                if (this.postType && this.postId) this.hasFav();
            },
        },
    },
};
</script>

<style lang="less" scoped>
.w-fav2 {
    .pointer;
    .dbi;
    .u-icon {
        .size(26px);
        .y;
        .pr;
    }
    .u-count {
        color: #888;
        .ml(10px);
    }

    .w-fav2_content {
        .flex;
        align-items: center;
    }
}
</style>

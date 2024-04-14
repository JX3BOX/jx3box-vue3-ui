<template>
    <div class="c-comment-cmt">
        <div class="c-comment-cmt__author">
            <el-link
                class="u-name"
                type="primary"
                target="_blank"
                :href="userHref"
                >{{ username || "人字榜800线无名小侠" }}</el-link
            >
            <span class="u-mark u-top" v-if="item.is_top"
                ><el-icon><Download></Download></el-icon>置顶</span
            >
            <span class="u-mark u-star" v-if="item.is_star"
                ><el-icon><Star></Star></el-icon>精华</span
            >
            <span class="u-mark u-secret" v-if="item.is_secret"
                ><el-icon><Cherry></Cherry></el-icon>悄悄话</span
            >
        </div>
        <CommentContent
        :date="item.commentDate"
            :content="item.content"
            :comment-id="item.id"
            :attachments="stringToArray(item.attachments)"
            :can-delete="power.can_del || power.uid == item.userId"
            :can-set-top="(power.is_author || power.is_editor) && !item.is_top"
            :can-cancel-top="(power.is_author || power.is_editor) && item.is_top"
            :can-set-star="!item.is_star && (power.is_author || power.is_editor)"
            :can-cancel-star="item.is_star &&(power.is_author || power.is_editor)"
            :can-add-white="!item.is_white && power.article_open_white == 1"
            :can-remove-white="item.is_white && (power.is_author == 1 || power.is_editor == 1)"
            :can-hide="(power.is_author == 1 || power.is_editor == 1)"
            :is-like="item.is_likes == 1"
            :likes="~~item.likes"
            @addNewReply="addNewReply"
            @deleteComment="deleteComment"
            @setTopComment="setTopComment"
            @setStarComment="setStarComment"
            @setLikeComment="setLikeComment"
            @setWhiteComment="setWhiteComment"
            @hide="hideComment"
        />
        <ReplyList
            :data="replyList"
            :pager="pager"
            :power="power"
            @addNewReply="addNewReply"
            @deleteReply="deleteReply"
            @goto="gotoReplyListIndex"
            @resetReply="resetReply"
            @setLikeComment="setLikeReply"
            @hide="hideComment"
        />
    </div>
</template>

<script>
import CommentContent from "./CommentContent.vue";
import ReplyList from "./ReplyList.vue";
import { POST, DELETE, GET } from "../../service/comment";
export default {
    props: ["item", "baseApi", "power", "user-href", "username"],
    components: {
        CommentContent,
        ReplyList
    },
    emits: [
        "deleteComment",
        "setTopComment",
        "setStarComment",
        "addNewReply",
        "deleteReply",
        "goto",
        "resetReply"
    ],
    data: function() {
        return {
            replyList: [],
            pager: {
                index: 1,
                pageSize: 10,
                pageTotal: 1,
                total: 0
            },

        };
    },
    created() {
        this.replyList = this.item.reply || [];
    },
    methods: {
        stringToArray: function(str) {
            if (!str) {
                return [];
            }
            return JSON.parse(str);
        },
        deleteComment() {
            this.$emit("deleteComment", this.item.id);
        },
        hideComment(){
            this.$emit("hide", this.item.id);
        },
        setTopComment(setTop) {
            this.$emit("setTopComment", this.item.id, setTop);
        },
        setStarComment(setStar) {
            this.$emit("setStarComment", this.item.id, setStar);
        },
        setLikeComment(setLike) {
            this.$emit("setLikeComment", this.item.id, setLike);
        },
        setLikeReply(id, setLike) {
            this.$emit("setLikeComment", id, setLike);
        },
        setWhiteComment( white) {
            this.$emit("setWhiteComment",  this.item.id, white);
        },
        addNewReply(data) {
            POST(`${this.baseApi}/comment/${this.item.id}/reply`, null, data)
                .then(() => {
                    this.$notify({
                        title: "",
                        message: "评论成功!",
                        type: "success",
                        duration: 3000,
                        position: "bottom-right"
                    });

                    this.loadReplyList(this.pager.index);
                })
                .catch(() => {});
        },
        deleteReply(id) {
            DELETE(`${this.baseApi}/comment/${id}`)
                .then(() => {
                    this.$notify({
                        title: "",
                        message: "删除成功!",
                        type: "success",
                        duration: 3000,
                        position: "bottom-right"
                    });
                    this.loadReplyList(this.pager.index);
                })
                .catch(() => {});
        },
        gotoReplyListIndex(index) {
            this.loadReplyList(index, 6);
        },
        loadReplyList(index, pageSize) {
            GET(
                `${this.baseApi}/comment/${this.item.id}/reply/page/${index}?pageSize=${pageSize}`
            )
                .then(resp => {
                    if (index == 1 && pageSize == 3) {
                        // eslint-disable-next-line vue/no-mutating-props
                        this.item.reply = resp.data || [];
                    }
                    this.replyList = resp.data || [];
                    this.pager = resp.page;
                })
                .catch(() => {});
        },
        resetReply() {
            this.loadReplyList(1, 3);
        }
    }
};
</script>

<style lang="less">
.c-comment-cmt {
    .u-name{
        margin-right: 6px;
    }
    .u-mark {
        font-style: normal;
        font-size: 12px;
        padding: 1px 5px 2px 5px;
        border-radius: 2px;
        color: #fff;
        margin-left: 5px;
        cursor: default;
    }
    .u-top {
        background-color: #6f42c1;
        i{
            transform: rotate(180deg);
        }
    }
    .u-star {
        background-color: #f39;
        i {
            margin-right: 2px;
        }
    }
    .u-secret{
        background-color:#ff99cc;
    }
}
</style>

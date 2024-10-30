<template>
    <div class="container-page">
        <Header></Header>
        <breadcrumb
            name="频道名称"
            slug="slug"
            root="/slug"
            :publishEnable="true"
            :feedbackEnable="true"
            :adminEnable="true"
            :crumbEnable="true"
        >
            <template #logo>
                <img svg-inline src="../assets/img/jx3.svg" />
            </template>
            <template #op-prepend>
                <!-- <AdminDirectMessage :user-id="8" :sourceId="19382" sourceType="macro"></AdminDirectMessage> -->
            </template>
        </breadcrumb>
        <LeftSidebar :open="true" :uid="7">
            <LeftSideToggle :mobileOnly="true" />
            <Author :uid="7" />
        </LeftSidebar>

        <Main :withoutLeft="false" :withoutRight="false">
            <!-- <Admin :fromList="true" :show="true" :postId="post_id" @update="update" :appDisabled="true"></Admin> -->
            <!-- <clientBy @filter="filterMeta" :type="client"></clientBy>

            <markBy @filter="filterMeta"></markBy>

            <zlpBy @filter="filterMeta" type="zlp" :client="client"></zlpBy>
            <orderBy @filter="filterMeta"></orderBy>
            <menuBy :data="['test1', 'test2']" @filter="filterMeta"></menuBy>
            <tagBy :data="['PVE', 'PVX']" :type="tag" @filter="filterMeta"></tagBy>
            <topicBy v-model="tag2" label="PVE" :topics="post_topics"></topicBy> -->
            <!--
            <Item :item_id="'6_27425'"></Item>
            <ItemSimple :item="item1" />

            <ItemSimple :item="item2" :only-icon="true" :with-name="true" :no-pop="true" iconSize="56px" />
            <ItemSimple :item="item2" :only-icon="true" iconSize="56px" />
            <ItemSimple :item="item3" :only-icon="true" iconSize="56px" />
            <ItemSimple :item="item4" :only-icon="true" iconSize="56px" />
            <ItemSimple :item="item5" jx3-client-type="1" only-icon="true" iconSize="56px" />
            <ItemSimple :item="item6" jx3-client-type="2" only-icon="true" iconSize="56px" /> -->
            <el-divider></el-divider>
            <UploadAlum />
            <!-- <PostHeader :post="post"></PostHeader> -->
            <singlebox :post="post" />
            <SimpleThxVue
                postType="bbs"
                postTitle="bbs23865的标题"
                :userId="7"
                :adminBoxcoinEnable="true"
                :userBoxcoinEnable="true"
                :allowGift="true"
                :postId="57260"
            />
            <Thx
                postType="bbs"
                postTitle="bbs23865的标题"
                type="batchReward"
                :userId="7"
                :adminBoxcoinEnable="true"
                :userBoxcoinEnable="true"
                :postId="57260"
                :allowGift="true"
                :showRss="true"
            />
            <Comment category="post" id="80449"></Comment>
            <RightSidebar :show-toggle="true">
                <PostTopic type="bps" :id="48857"></PostTopic>
                <div id="directory"></div>
            </RightSidebar>

            <Footer> </Footer>
            <!-- <Bottom></Bottom> -->
        </Main>
    </div>
</template>

<script>
import singlebox from "./single/cms-single.vue";
import UploadAlum from "./editor/UploadAlum.vue";
import Author from "./single/Author.vue";
import SimpleThxVue from "./single/SimpleThx.vue";
import Comment from "./single/Comment.vue";
import Thx from "./single/Thx.vue";
// import PostHeader from "./single/PostHeader.vue";
import PostTopic from "./single/PostTopic.vue";
import axios from "axios";
import post_topics from "@jx3box/jx3box-common/data/post_topics.json";
import { get_item } from "../service/item";
// import AdminDirectMessage from "./bread/AdminDirectMessage.vue";
// import Admin from "@/bread/Admin.vue";
export default {
    name: "App",
    components: {
        SimpleThxVue,
        Author,
        Comment,
        Thx,
        // PostHeader,
        PostTopic,
        UploadAlum,
        // AdminDirectMessage,
        singlebox,
        // Admin,
    },
    data() {
        return {
            post_id: "54842",
            post: "",
            client: location.href.includes("origin") ? "origin" : "std",
            tag: "",
            post_topics: post_topics["bps_pve"],
            tag2: "",
            item1: null,
            item2: null,
            item3: null,
            item4: null,
            item5: null,
            item6: null,
        };
    },
    watch: {
        post_id: {
            immediate: true,
            handler: function () {
                this.loadPost();
            },
        },
    },
    methods: {
        update(data) {
            console.log(data);
        },
        loadPost() {
            axios.get(`/api/cms/post/${this.post_id}`).then((res) => {
                this.post = res.data.data;
                this.$forceUpdate();
            });
        },
        filterMeta(val) {
            console.log(val);
        },
        loadItems() {
            get_item("10_310").then((res) => {
                let data = res.data;
                if (data.code === 200) {
                    let item = data.data.item;
                    this.item1 = JSON.stringify(item) !== "{}" ? item : null;
                }
            });

            get_item("6_4396").then((res) => {
                let data = res.data;
                if (data.code === 200) {
                    let item = data.data.item;
                    this.item2 = JSON.stringify(item) !== "{}" ? item : null;
                }
            });

            get_item("10_202").then((res) => {
                let data = res.data;
                if (data.code === 200) {
                    let item = data.data.item;
                    this.item3 = JSON.stringify(item) !== "{}" ? item : null;
                }
            });

            get_item("10_98").then((res) => {
                let data = res.data;
                if (data.code === 200) {
                    let item = data.data.item;
                    this.item4 = JSON.stringify(item) !== "{}" ? item : null;
                }
            });

            get_item("5_3028", 1).then((res) => {
                let data = res.data;
                if (data.code === 200) {
                    let item = data.data.item;
                    this.item5 = JSON.stringify(item) !== "{}" ? item : null;
                }
            });

            get_item("5_3028", 2).then((res) => {
                let data = res.data;
                if (data.code === 200) {
                    let item = data.data.item;
                    this.item6 = JSON.stringify(item) !== "{}" ? item : null;
                }
            });
        },
    },
    mounted() {
        // this.loadItems();
    },
};
</script>

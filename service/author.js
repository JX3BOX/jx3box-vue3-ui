import axios from "axios";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { $next, $cms, $team, $pay } from "@jx3box/jx3box-common/js/https_v2.js";

async function getUserInfo(uid) {
    const res = await $cms({ mute: true }).get(`/api/cms/user/${uid}/info`);
    return res.data.data;
}

// 根据用户id或者昵称获取用户信息
async function getUserInfoByUidOrName(params) {
    const res = await $cms({ mute: true }).get(`/api/cms/user/search`, {
        params: params,
    });
    return res.data.data;
}

async function getMyInfo() {
    const res = await $cms({ mute: true }).get(`/api/cms/user/my/info`);
    return res.data.data;
}

async function getUserPosts(uid) {
    const res = await $cms({ mute: true }).get(`/api/cms/posts/user/${uid}/latest`);
    return res.data.data.list || [];
}

async function getDouyu(ids) {
    const res = await $next({ mute: true }).get("/team/douyu", {
        params: {
            tv_id: ids,
        },
    });
    return res.data.data;
}

async function getUserMedals(uid) {
    return $cms({ mute: true })
        .get("/api/cms/user/medal/" + uid)
        .then((res) => {
            return res.data.data;
        });
}

function getFrames() {
    return axios.get(JX3BOX.__imgPath + "avatar/index.json");
}

async function getUserPublicTeams(uid) {
    const res = await $team({ mute: true }).get(`/api/team/relation/public`, {
        params: {
            uid: uid,
        },
    });
    return res.data.data;
}

function getSuperAuthor(uid) {
    return $cms().get("/api/cms/user/is_super_author/" + uid);
}

function userSignIn() {
    return $pay({ mute: true }).get(`/api/personal/task/everyday/sign-in`);
}

function getFansList(userid) {
    return $pay().get(`/api/cny/consume/user-charge/rank/of/${userid}?limit=0`);
}

// 获取指定表情
function getEmotion(id) {
    return $cms().get(`/api/cms/post/emotion/${id}`);
}

export {
    getUserInfo,
    getUserPosts,
    getDouyu,
    getUserMedals,
    getFrames,
    getUserPublicTeams,
    getSuperAuthor,
    getMyInfo,
    userSignIn,
    getFansList,
    getUserInfoByUidOrName,
    getEmotion,
};

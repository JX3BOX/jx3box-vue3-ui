import { $cms } from "@jx3box/jx3box-common/js/https_v2";
import axios from "axios";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
function getPostAuthors(post_id) {
    return $cms({ mute: true }).get(`/api/cms/post/${post_id}/authors`);
}

function uploadImage(formData) {
    return $cms().post(`/api/cms/upload/avatar`, formData);
}
//获取装扮
function getDecoration(params) {
    return $cms().get(`/api/cms/user/decoration`, {
        params,
    });
}
function getDecorationJson() {
    let url = JX3BOX.__imgPath + "decoration/index.json";
    return axios.get(url);
}
function getHonorJson() {
    let url = JX3BOX.__imgPath + "decoration/honor.json";
    return axios.get(url);
}
// 通用上传
function upload(formData) {
    return $cms().post(`/api/cms/upload`, formData);
}

// 检测当前用户是否为团队成员
function checkTeamMember() {
    return $cms().get(`/api/cms/config/teammates/check`);
}

export { getPostAuthors, uploadImage, upload, getDecoration, getDecorationJson, checkTeamMember, getHonorJson };

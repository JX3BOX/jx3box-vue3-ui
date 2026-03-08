<template>
    <div class="c-header-panel" id="c-header-panel">
        <el-tooltip effect="dark" content="创作中心" placement="bottom" popper-class="c-header-tooltip">
            <a class="u-post" :href="url">
                <editIcon class="u-add" />
            </a>
        </el-tooltip>
    </div>
</template>

<script>
import { __Links } from "@/config/data/jx3box.json";
import editIcon from "@/assets/img/components/common/header/edit.svg";
export default {
    name: "publish",
    components: {
        editIcon,
    },
    data: function () {
        return {
            url: __Links.dashboard.publish,
        };
    },
};
</script>

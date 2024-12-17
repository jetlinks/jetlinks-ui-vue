<template>
    <div v-for="(i,index) in data" class="uploadFile">
        <img :src="i.img" alt="" style="width: 80px;height: 80px;">
        <div style="width: calc(100% - 80px);">
            <div class="fileInfoHeader">
                <div>
                    <div>
                        {{ i?.name }}
                        <span class="fileType">
                            {{ i?.type }}
                        </span>
                    </div>
                    <div>
                        {{ i?.version }}
                    </div>
                </div>
                <div class="control">
                    <slot name="control" :data="i" :index=index></slot>
                </div>
            </div>
            <div class="fileInfoFooter">
                <div class="install_container">
                    <a-badge status="default" />
                    <div class="installStatue">版本更新</div>
                    <div>(当前版本:V1.2.1)</div>
                </div>
                <div class="description"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    data:{
        type: Array,
        default: []
    }
})
</script>
<style lang='less' scoped>
.uploadFile {
    display: flex;
    margin-top: 8px;
    text-align: start;

    .fileInfoHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid rgb(205, 205, 205);
        padding-bottom: 8px;

        .fileType {
            background-color: rgb(206, 234, 214);
            margin-left: 6px;
            padding: 0 6px;
            border-radius: 6px;
            color: rgb(23, 129, 60)
        }
    }

    .fileInfoFooter {
        color: #878787;
        margin-top: 8px;
        font-size: 12px;

        .install_container {
            display: flex;
            vertical-align: middle;

            .installStatue {
                color: black;
                margin-right: 6px;
            }
        }
    }
}
</style>
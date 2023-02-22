<template>
    <a-modal
        :maskClosable="false"
        width="600px"
        :visible="true"
        title="详情"
        okText="确定"
        cancelText="取消"
        @ok="handleCancel"
        @cancel="handleCancel"
    >
        <template v-if="['.jpg', '.png'].includes(type)">
            <a-image :src="value?.formatValue" />
        </template>
        <template v-else-if="['.flv', '.m3u8', '.mp4'].includes(type)">
            <!-- TODO 视频组件缺失 -->
        </template>
        <template v-else>
            <!-- <json-viewer
                :value="{
                    'id': '123'
                }"
                copyable
                boxed
                sort
            ></json-viewer> -->
        </template>
    </a-modal>
</template>

<script lang="ts" setup>
// import JsonViewer from 'vue3-json-viewer';

const _data = defineProps({
    type: {
        type: String,
        default: '',
    },
    value: {
        type: [Object, String],
        default: () => {},
    },
});
const _emit = defineEmits(['close']);
const handleCancel = () => {
    _emit('close');
};

// watchEffect(() => {
//     console.log(_data.value?.formatValue)
// })
</script>

<style lang="less" scoped>
</style>
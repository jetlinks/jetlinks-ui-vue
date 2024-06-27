<template>
    <j-modal
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
            <j-image :src="value?.formatValue" />
        </template>
        <template v-else-if="['.flv', '.m3u8', '.mp4'].includes(type)">
            <LivePlayer :url="value?.formatValue" autoplay />
        </template>
        <template v-else>
            <JsonViewer
                :expand-depth="5"
                :value="value?.formatValue"
            />
        </template>
    </j-modal>
</template>

<script lang="ts" setup>
import JsonViewer from 'vue-json-viewer';
import LivePlayer from '@/components/Player/index.vue';

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

</script>

<style lang="less" scoped>
</style>
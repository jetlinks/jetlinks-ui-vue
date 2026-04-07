<template>
    <a-modal
        :maskClosable="false"
        width="600px"
        :open="true"
        :title="$t('Event.index.277611-0')"
        :okText="$t('Save.index.912481-0')"
        :cancelText="$t('Save.index.912481-1')"
        @ok="handleCancel"
        @cancel="handleCancel"
    >
        <template v-if="['.jpg', '.png', '.jpeg'].includes(type)">
            <a-image :src="value?.formatValue" />
        </template>
        <template v-else-if="['.flv', '.m3u8', '.mp4'].includes(type)">
            <div style="height: 300px">
              <Player :url="value?.formatValue" autoplay :live="false" />
            </div>
        </template>
        <template v-else>
            <JsonViewer
                :expand-depth="5"
                :value="value?.formatValue"
            />
        </template>
    </a-modal>
</template>

<script lang="ts" setup>
import { JsonViewer } from 'vue3-json-viewer';

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

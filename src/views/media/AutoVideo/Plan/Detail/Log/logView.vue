<template>
    <a-drawer
        title="执行日志"
        visible
        @close="emit('close')"
        :maskClosable="false"
        width="600px"
    >
        <a-descriptions  bordered size="small">
            <a-descriptions-item :span="3" label="执行状态">{{data.state?.text}}</a-descriptions-item>
            <a-descriptions-item :span="3" label="通道ID">{{data.channelId}}</a-descriptions-item>
            <a-descriptions-item :span="3" label="通道名称">{{data.channelName}}</a-descriptions-item>
            <a-descriptions-item :span="3" label="通道目录">{{data.channelCatalog || '-'}}</a-descriptions-item>
            <a-descriptions-item :span="3" label="设备ID">{{data.deviceId}}</a-descriptions-item>
            <a-descriptions-item :span="3" label="设备名称">{{data.deviceName}}</a-descriptions-item>
            <a-descriptions-item :span="3" label="安装地址">{{data.address}}</a-descriptions-item>
            <a-descriptions-item :span="3" label="厂家">{{data.manufacturer}}</a-descriptions-item>
            <a-descriptions-item :span="3" label="日志流水">
                <div style="max-height: 400px; overflow-y: auto">
                    <JsonViewer
                        :value="data"
                        :expanded="true"
                        :expandDepth="4"
                    />
                </div>
            </a-descriptions-item>
            
        </a-descriptions>
    </a-drawer>
</template>

<script setup name="logView">
import JsonViewer from 'vue-json-viewer';
const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
});

const emit = defineEmits(['close']);
</script>

<style lang="less" scoped></style>

<template>
    <a-descriptions bordered :labelStyle="{width: '200px'}">
        <template #title>
            <a-space>
                <span>基础信息</span>
                <a-button type="link" @click="visible = true">
                    <AIcon type="EditOutlined"></AIcon>
                </a-button>
            </a-space>
        </template>
        <a-descriptions-item label="ID">
            {{data.id}}
        </a-descriptions-item>
        <a-descriptions-item v-if="data.targetType === 'AiModel'" label="文件">
            {{data.properties?.fileName}}
        </a-descriptions-item>
        <a-descriptions-item v-else-if="data.targetType === 'PluginDriver'" label="文件">
            {{JSON.parse(data.metadata || '{}')?.filename}}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">
            {{dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss') || '--'}}
        </a-descriptions-item>
        <a-descriptions-item label="创建者">
            {{data.creatorName || '--'}}
        </a-descriptions-item>
        <template v-if="data.targetType === 'entityTemplate:Collector'">
            <a-descriptions-item label="通讯协议">
                {{metadata.category}}
            </a-descriptions-item>
        </template>
        <a-descriptions-item label="说明">
            {{metadata?.description || '--'}}
        </a-descriptions-item>
    </a-descriptions>
    <template v-if="data.targetType === 'entityTemplate:Collector'">
        <div class="title">
            <span>点位信息</span>
        </div>
        <Points :dataSource="JSON.parse(metadata.metadata || '{}')?.points" />
    </template>
    <Save v-if="visible" :data="data" @close="visible = false" @save="handleSave"/>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import {PropType} from "vue";
import Save from '../../Save/index.vue';
import Points from "./Points.vue";


const emit = defineEmits(['refresh'])
const props = defineProps({
    data: {
        type: Object as PropType<Record<string, any>>,
        default: () => ({}),
    }
})

const metadata = computed(() => {
    return JSON.parse(props.data.metadata || '{}')
})

const visible = ref(false);
const route = useRoute();

const handleSave = () => {
    visible.value = false;
    emit('refresh');
}
</script>

<style scoped lang="less">
.title {
    margin: 16px 0;
    font-size: 16px;
    font-weight: bold;
}
</style>
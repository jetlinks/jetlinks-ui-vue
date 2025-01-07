<template>
    <a-drawer visible :title="data.name" :width="600">
        <TitleComponent data="基础信息" />
        <a-descriptions :column="2">
            <a-descriptions-item label="ID">{{
                info.id || '--'
            }}</a-descriptions-item>
            <a-descriptions-item label="版本">{{
                info.version || '--'
            }}</a-descriptions-item>
            <a-descriptions-item label="插件类型">{{
                TypeMap[info.type] || '--'
            }}</a-descriptions-item>
            <a-descriptions-item label="创建时间">{{
                dayjs(info.createTime).format('YYYY-MM-DD HH:mm:ss') || '--'
            }}</a-descriptions-item>
            <a-descriptions-item label="创建方式">
                {{ info?.configuration?.sourceId ? '自动创建' : '手动创建' }}
                <a-tooltip
                    v-if="info?.configuration?.sourceId"
                    title="资源库中数采类型的资源将为您自动安装。为了系统正常运行，自动安装的资源暂不允许编辑和删除"
                    ><AIcon
                        type="QuestionCircleOutlined"
                        style="margin-left: 2px"
                    />
                </a-tooltip>
            </a-descriptions-item>
        </a-descriptions>
    </a-drawer>
</template>

<script setup lang="ts" name="Detail">
import { TypeMap } from './util';
import dayjs from 'dayjs';
const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
});
const info = ref<any>({});

onMounted(() => {
    info.value = props.data;
});
</script>

<style lang="less" scoped></style>

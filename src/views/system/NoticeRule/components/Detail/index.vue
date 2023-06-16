<template>
    <j-modal :width="800" visible title="配置详情" @cancel="emit('close')">
        <j-descriptions bordered :column="2">
            <j-descriptions-item label="通知方式">{{
                data.name
            }}</j-descriptions-item>
            <j-descriptions-item label="通知配置">{{
                obj.notifier
            }}</j-descriptions-item>
            <j-descriptions-item label="通知模板">{{
                obj.template
            }}</j-descriptions-item>
            <j-descriptions-item label="模版内容">{{ 
                obj.content 
            }}</j-descriptions-item>
            <j-descriptions-item label="模板变量">
                <div v-for="item in obj.variables" :key="item?.value">{{ item?.name }}: {{ item?.value }}</div>
            </j-descriptions-item>
            <j-descriptions-item label="用户权限">{{
                obj.role
            }}</j-descriptions-item>
        </j-descriptions>
        <template #footer>
            <j-button type="primary" @click="emit('close')">确定</j-button>
        </template>
    </j-modal>
</template>

<script lang="ts" setup>
import ConfigApi from '@/api/notice/config';
import TemplateApi from '@/api/notice/template';
import { getRoleList_api } from '@/api/system/user';

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});
const emit = defineEmits(['close', 'save']);

const obj = reactive<{
    notifier: string;
    template: string;
    content: string;
    variables: any[],
    role: string;
}>({
    notifier: '',
    template: '',
    content: '',
    variables: [],
    role: '',
});

const handleSearch = async () => {
    // 查询通知配置
    if (props.data?.channelConfiguration?.notifierId) {
        const resp = await ConfigApi.detail(
            props.data?.channelConfiguration?.notifierId,
        );
        if (resp.status === 200) {
            obj.notifier = resp.result?.name;
        }
    }
    // 查询通知模板
    if (props.data?.channelConfiguration?.templateId) {
        const resp = await TemplateApi.detail(
            props.data?.channelConfiguration?.templateId,
        );
        if (resp.status === 200) {
            obj.template = resp.result?.name;
            obj.content = resp.result?.template?.message;
            if (
                resp.result?.variableDefinitions?.length &&
                props.data?.channelConfiguration?.variables
            ) {
                obj.variables = (resp.result?.variableDefinitions || []).map(
                    (item: any) => {
                        return {
                            name: item.name,
                            value:
                                props.data?.channelConfiguration?.variables?.[
                                    item?.id
                                ]?.value || '',
                        };
                    },
                );
            }
        }
    }
    // 查询用户权限
    if (props.data?.grant?.role?.idList?.length) {
        const resp: any = await getRoleList_api();
        if (resp.status === 200) {
            obj.role = props.data?.grant?.role?.idList
                .map((item: string) => {
                    return (resp?.result || []).find((i: any) => i?.id === item)?.name
                })
                ?.join(',');
        }
    }
};

onMounted(() => {
    handleSearch();
});
</script>
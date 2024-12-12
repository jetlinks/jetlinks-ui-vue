<template>
    <a-modal :width="644" visible :title="$t('Detail.index.056969-0')" @cancel="emit('close')">
        <div class="detail">
            <div class="item">
                <div class="label">{{ $t('Detail.index.056969-1') }}</div>
                <div class="value">
                    <j-ellipsis :lineClamp="2">{{ data.name }}</j-ellipsis>
                </div>
            </div>
            <div class="item">
                <div class="label">{{ $t('Detail.index.056969-2') }}</div>
                <div class="value">
                    <j-ellipsis :lineClamp="2">{{ obj.notifier }}</j-ellipsis>
                </div>
            </div>
            <div class="item">
                <div class="label">{{ $t('Detail.index.056969-3') }}</div>
                <div class="value">
                    <j-ellipsis :lineClamp="2">{{ obj.template }}</j-ellipsis>
                </div>
            </div>
            <div class="item">
                <div class="label">{{ $t('Detail.index.056969-4') }}</div>
                <div class="value">
                    <j-ellipsis :lineClamp="2">{{ obj.content }}</j-ellipsis>
                </div>
            </div>
            <div class="item">
                <div class="label">{{ $t('Detail.index.056969-5') }}</div>
                <div class="value">
                    <j-ellipsis :lineClamp="2">{{ variables }}</j-ellipsis>
                </div>
            </div>
            <div class="item">
                <div class="label">{{ $t('Detail.index.056969-6') }}</div>
                <div class="value">
                    <j-ellipsis :lineClamp="2">{{ obj.role }}</j-ellipsis>
                </div>
            </div>
        </div>
        <template #footer>
            <a-button type="primary" @click="emit('close')">{{ $t('Detail.index.056969-7') }}</a-button>
        </template>
    </a-modal>
</template>

<script lang="ts" setup>
import ConfigApi from '@/api/notice/config';
import TemplateApi from '@/api/notice/template';
import { queryConfigVariables } from '@/api/system/noticeRule';
import { getRoleList_api } from '@/api/system/user';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});
const emit = defineEmits(['close', 'save']);
const builtInList = ref<any[]>([]);

const obj = reactive<{
    notifier: string;
    template: string;
    content: string;
    variables: any[];
    role: string;
}>({
    notifier: '',
    template: '',
    content: '',
    variables: [],
    role: $t('Detail.index.056969-8'),
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
                const config = props.data?.channelConfiguration?.variables
                const t = Object.keys(config)?.find(
                    (i: any) => config?.[i]?.source === 'upper',
                );
                if (t && !builtInList.value.length) {
                    const _variables = await queryConfigVariables(
                        props.data.providerId,
                    );
                    if (_variables.status === 200) {
                        // 避免数据id相同，去重
                        const _set = new Set(
                            (_variables.result as any[]).map(
                                (item) => item?.id,
                            ),
                        );
                        const arr = [..._set.values()].map((item) => {
                            const _arr = (_variables.result as any[]).reverse();
                            return _arr.find((i) => i.id === item);
                        });
                        builtInList.value = arr.map((item) => {
                            return {
                                ...item,
                                id: 'detail.' + item.id, // 为了方便传到后端
                            };
                        });
                    }
                }
                obj.variables = (resp.result?.variableDefinitions || []).map(
                    (item: any) => {
                        const _item =
                            config?.[
                                item?.id
                            ];
                        return {
                            name: item.name,
                            value: _item?.value || builtInList.value.find(i => _item.upperKey === i.id)?.name || _item.upperKey,
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
            obj.role =
                props.data?.grant?.role?.idList
                    .map((item: string) => {
                        return (resp?.result || []).find(
                            (i: any) => i?.id === item,
                        )?.name;
                    })
                    ?.join(';') || $t('Detail.index.056969-8');
        }
    }
};

const variables = computed(() => {
    return obj.variables
        .map((item) => {
            return `${item?.name} - ${item?.value}`;
        })
        .join(';');
});

onMounted(() => {
    handleSearch();
});
</script>

<style lang="less" scoped>
.detail {
    border: 1px solid #ebeef3;
    border-radius: 2px;
    .item {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 14px 16px;
        border-bottom: 1px solid #ebeef3;
        gap: 24px;
        .label {
            color: #333333;
            width: 125px;
        }

        .value {
            color: #666666;
            text-align: right;
        }

        &:last-child {
            border: none;
        }
    }
}
</style>
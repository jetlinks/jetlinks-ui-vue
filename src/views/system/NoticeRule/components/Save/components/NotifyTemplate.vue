<template>
    <div class="header">
        <pro-search
            :columns="columns"
            target="action-notice-template"
            type="simple"
            @search="handleSearch"
            style="padding: 0"
        />
        <j-permission-button
            @click="onAdd"
            type="primary"
            :hasPermission="['notice/Template:add']"
        >
            {{ $t('components.NotifyTemplate.016284-0') }}
        </j-permission-button>
    </div>
    <div class="alert">
        <AIcon type="InfoCircleOutlined" />
        {{ $t('components.NotifyTemplate.016284-1') }}
    </div>
    <div style="max-height: 400px; overflow-y: auto">
        <JProTable
            :columns="columns"
            :request="(e) => handleData(e)"
            mode="CARD"
            :bodyStyle="{
                padding: 0,
            }"
            ref="tableRef"
            :alertShow="false"
            :params="params"
            :gridColumn="3"
            :noPagination="true"
            :rowSelection="{
                selectedRowKeys: _selectedRowKeys,
                onChange: onSelectChange,
            }"
        >
            <template #card="slotProps">
                <CardBox
                    :showStatus="false"
                    :value="slotProps"
                    :showTool="false"
                    :actions="[]"
                    v-bind="slotProps"
                    @click="handleClick"
                    :active="_selectedRowKeys.includes(slotProps.id)"
                >
                    <template #img>
                        <slot name="img">
                            <img
                                :src="
                                    getLogo(slotProps.type, slotProps.provider)
                                "
                                class="notify-logo"
                            />
                        </slot>
                    </template>
                    <template #content>
                        <j-ellipsis style="width: calc(100% - 100px)">
                            <span style="font-size: 16px; font-weight: 600">
                                {{ slotProps.name }}
                            </span>
                        </j-ellipsis>
                        <a-row>
                            <a-col :span="12">
                                <div class="card-item-content-text">
                                    {{ $t('components.NotifyTemplate.016284-2') }}
                                </div>
                                <div>
                                    {{ getMethodTxt(slotProps.type) }}
                                </div>
                            </a-col>
                            <a-col :span="12">
                                <div class="card-item-content-text">{{ $t('components.NotifyTemplate.016284-3') }}</div>
                                <j-ellipsis>
                                    {{ slotProps.description }}
                                </j-ellipsis>
                            </a-col>
                        </a-row>
                        <div style="height: 30px">
                            <j-ellipsis :lineClamp="2">
                                {{ slotProps.template?.message || '' }}
                            </j-ellipsis>
                        </div>
                    </template>
                </CardBox>
            </template>
        </JProTable>
    </div>
</template>

<script lang="ts" setup>
import TemplateApi from '@/api/notice/template';
import { MSG_TYPE, NOTICE_METHOD } from './const';
import { noticeType, _variableMap } from '../../../data';
import { useI18n } from 'vue-i18n';
import { cloneDeep } from "lodash-es";

const { t: $t } = useI18n();
const props = defineProps({
    notifierId: {
        type: String,
        default: '',
    },
    value: {
        type: String,
        default: '',
    },
    notifyType: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['update:value', 'change', 'update:detail']);

const getLogo = (type: string, provider: string) => {
    return MSG_TYPE[type].find((f: any) => f.value === provider)?.logo;
};

const getMethodTxt = (type: string) => {
    return NOTICE_METHOD.find((f) => f.value === type)?.label;
};

const tableRef = ref<any>();

const params = ref<Record<string, any>>({});
const _selectedRowKeys = ref<string[]>([]);

const columns = [
    {
        title: $t('components.NotifyTemplate.016284-4'),
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
    },
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('components.NotifyTemplate.016284-3'),
        dataIndex: 'description',
        key: 'description',
        search: {
            type: 'string',
        },
    },
];

const handleSearch = (_params: any) => {
    params.value = _params;
};

const handleClick = (dt: any) => {
    if (_selectedRowKeys.value.includes(dt.id)) {
        _selectedRowKeys.value = [];
        emit('update:value', undefined);
        emit('change', { templateName: undefined, value: undefined });
        emit('update:detail', undefined);
    } else {
        _selectedRowKeys.value = [dt.id];
        emit('update:value', dt.id);
        emit('change', { templateName: dt?.name, value: dt?.id });
        emit('update:detail', dt);
    }
};

const onSelectChange = (keys: string[]) => {
    _selectedRowKeys.value = [...keys];
};

const handleData = async (e: any) => {
    const sorts = [
        { name: 'id', value: props.value },
        { name: 'createTime', order: 'desc' },
    ];
    const resp = await TemplateApi.getListVariableByConfigId(props.notifierId, {
        ...e,
        sorts: sorts,
    });
    const result = (resp?.result || []).filter((item: any) => {
        const _variable = _variableMap.get(item.type);
        const arr = item?.variableDefinitions?.map((i: any) => i?.id) || [];
        return arr.includes(_variable);
    });

    const data = cloneDeep(resp)
    data.result.data = result
    return data
};

const onAdd = () => {
    const tab: any = window.open(
        `${origin}/#/iot/notice/Template/detail/:id?notifyType=${noticeType.get(
            props.notifyType,
        )}&notifierId=${props.notifierId}`,
    );
    tab.onTabSaveSuccess = (value: any) => {
        _selectedRowKeys.value = [value.id];
        emit('update:value', value.id);
        emit('change', { templateName: value?.name, value: value?.id });
        emit('update:detail', value);
        tableRef.value?.reload();
    };
};

watch(
    () => props.value,
    (newValue) => {
        if (newValue) {
            _selectedRowKeys.value = [newValue];
        } else {
            _selectedRowKeys.value = [];
        }
    },
    {
        deep: true,
        immediate: true,
    },
);
</script>

<style lang="less" scoped>
.action-search {
    padding: 0;
}

.notify-logo {
    width: 88px;
    height: 88px;
}
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}
.alert {
    height: 40px;
    padding: 0 20px 0 10px;
    margin-bottom: 10px;
    color: rgba(0, 0, 0, 0.55);
    line-height: 40px;
    background-color: #f6f6f6;
}
:deep(.JSearch-warp) {
  margin-bottom: 0 !important;
}
</style>

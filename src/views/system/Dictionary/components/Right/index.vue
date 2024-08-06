<template>
    <div class="des">
        <div class="des_head">
            <div>{{ $t('Right.index.464664-0') }}<span>{{ data.id }}</span></div>
            <div style="display: flex;">{{ $t('Right.index.464664-1') }}<Ellipsis style="width: calc(100% - 200px);"><span>{{ data.describe }}</span></Ellipsis></div>
            <div>{{ $t('Right.index.464664-2') }}<span> {{
                dayjs(
                    data?.createTime,
                ).format(
                    'YYYY-MM-DD HH:mm:ss',
                )
            }}</span></div>
        </div>
        <div class="contain">
            <pro-search :columns="columns" @search="handleSearch" target="system_dictionary" />
            <JProTable :columns="columns" model="TABLE" :request="queryItem" :params="params" ref="tableRef">
                <template #headerTitle>
                    <PermissionButton type="primary" @click="add" hasPermission="system/Dictionary:add">
                        {{ $t('Right.index.464664-3') }}
                    </PermissionButton>
                </template>
                <template #action="slotProps">
                    <j-space :size="16">
                        <template v-for="i in getActions(slotProps, 'table')" :key="i.key">
                            <PermissionButton :disabled="i.disabled" :popConfirm="i.popConfirm" :tooltip="{
                                ...i.tooltip,
                            }" @click="i.onClick" type="link" style="padding: 0 5px" :danger="i.key === 'delete'"
                                :hasPermission="'system/Dictionary:' + i.key
                                    ">
                                <template #icon>
                                    <AIcon :type="i.icon" />
                                </template>
                            </PermissionButton>
                        </template>
                    </j-space>
                </template>
            </JProTable>
        </div>
    </div>
    <Save v-if="saveVisible" :dicId='data.id' :type="modalType" :data="current" :sort=sort @closeModal="closeModal"
        @refresh="refresh" />
</template>

<script lang="ts" setup>
import { queryDicItem, deleteDicItem, queryDicItemNoPage } from '@/api/system/dictionary'
import Save from './Save/index.vue'
import type { ActionsType } from './typings';
import { onlyMessage } from '@/utils/comm';
import { cloneDeep } from 'lodash-es';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({
    data: {
        type: Object,
        default: {}
    },
})
const params = ref()
const tableRef = ref()
const saveVisible = ref(false)
const sort = ref(0)
const modalType = ref('add')
const current = ref()
const columns = [
    {
        title: $t('Right.index.464664-4'),
        dataIndex: 'searchCode',
        hideInTable: true,
        search: {
            type: 'string'
        }
    },
    {
        title: 'name',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string'
        }
    },
    {
        title: 'value',
        dataIndex: 'value',
        key: 'value',
        ellipsis: true,
        search: {
            type: 'string'
        }
    },
    {
        title: 'text',
        dataIndex: 'text',
        key: 'text',
        ellipsis: true,
        search: {
            type: 'string'
        }
    }, {
        title: $t('Right.index.464664-5'),
        dataIndex: 'action',
        key: 'action',
        scopedSlots: true,
    }
];

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'update',
            text: $t('Right.index.464664-6'),
            tooltip: {
                title: $t('Right.index.464664-6'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                saveVisible.value = true;
                modalType.value = 'edit';
                current.value = data
            },
        },
        {
            key: 'delete',
            text: $t('Right.index.464664-7'),
            tooltip: {
                title: $t('Right.index.464664-7'),
            },
            popConfirm: {
                title: $t('Right.index.464664-8'),
                onConfirm: async () => {
                    const res = await deleteDicItem(data.id)
                    if (res.status === 200) {
                        onlyMessage($t('Right.index.464664-9'))
                        tableRef.value.reload()
                    } else {
                        onlyMessage($t('Right.index.464664-10'), 'error')
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    if (type === 'card')
        return actions.filter((i: ActionsType) => i.key !== 'view');
    return actions;
};
const add = () => {
    modalType.value = 'add'
    current.value = {}
    queryDicItemNoPage({
        paging: false, 
        sorts: [{ name: 'ordinal', order: 'desc' }],
        terms: [{
            column: 'dictId',
            termType: 'eq',
            value: props.data?.id
        }]
    }).then((res:any)=>{
        sort.value = res.result?.length ?  res.result[0].ordinal + 1 : 1 
        saveVisible.value = true
    })
}

const closeModal = () => {
    saveVisible.value = false
}
const handleSearch = (i: any) => {
    params.value = i
}
const refresh = () => {
    saveVisible.value = false
    tableRef.value.reload()
}
const queryItem = async (_params: any) => {
    if (props.data?.id) {
        const params = {
            ..._params,
            sorts: [{ name: 'ordinal', order: 'desc' }],
            terms: [
                ..._params.terms,
                {
                    column: 'dictId',
                    termType: 'eq',
                    value: props.data?.id
                },
            ],
        };
        const resp: any = await queryDicItem(params);
        if (resp.status === 200) {
            const arr = cloneDeep(resp.result.data)
            arr?.sort((a: any, b: any) => {
                return b.ordinal - a.ordinal
            })
            return {
                code: resp.status,
                result: resp.result,
                status: resp.status,
            };
        }
    } else {
        return {
            code: 200,
            result: {
                data: [],
                pageIndex: 0,
                pageSize: 0,
                total: 0,
            },
            status: 200,
        };
    }
}
watch(() => props?.data?.id, () => {
    tableRef.value.reload()
})  
</script>
<style lang="less" scoped>
.des_head {
    padding: 10px 20px;
    background-color: rgb(242, 242, 242);

    span {
        color: rgb(127, 127, 127)
    }
}
</style>
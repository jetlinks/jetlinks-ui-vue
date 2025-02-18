<template>
    <div class="des">
        <div class="des_head">
            <div>{{ $t('Right.index.572408-0') }}<span>{{ data.id }}</span></div>
            <div style="display: flex;">{{ $t('Right.index.572408-1') }}<j-ellipsis style="width: calc(100% - 200px);"><span>{{ data.describe }}</span></j-ellipsis></div>
            <div>{{ $t('Right.index.572408-2') }}{{data?.createTime ? dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss') : ''}}</div>
        </div>
        <div class="contain">
            <pro-search style="padding: 18px 0" :columns="columns" noMargin @search="handleSearch" target="system_dictionary" />
            <JProTable :bodyStyle="{
                padding: 0,
            }" :scroll="{ y: 'calc(100vh - 500px)' }" :columns="columns" mode="TABLE" :request="queryItem" :params="params" ref="tableRef">
                <template #headerLeftRender>
                    <j-permission-button type="primary" @click="add" hasPermission="system/Dictionary:add">
                        {{ $t('Right.index.572408-3') }}
                    </j-permission-button>
                </template>
                <template #action="slotProps">
                    <a-space>
                        <template v-for="i in getActions(slotProps, 'table')" :key="i.key">
                            <j-permission-button :disabled="i.disabled" :popConfirm="i.popConfirm" :tooltip="{
                                ...i.tooltip,
                            }" @click="i.onClick" type="link" style="padding: 0 5px" :danger="i.key === 'delete'"
                                :hasPermission="'system/Dictionary:' + i.key
                                    ">
                                <template #icon>
                                    <AIcon :type="i.icon" />
                                </template>
                            </j-permission-button>
                        </template>
                    </a-space>
                </template>
            </JProTable>
        </div>
    </div>
    <Save v-if="saveVisible" :dicId='data.id' :type="modalType" :data="current" :sort=sort @closeModal="closeModal"
        @refresh="refresh" />
</template>

<script lang="ts" setup name="DictionaryItem">
import dayjs from 'dayjs';
import { queryDicItem, deleteDicItem, queryDicItemNoPage } from '@/api/system/dictionary'
import Save from './Save/index.vue'
import { onlyMessage } from '@jetlinks-web/utils';
import { cloneDeep } from 'lodash-es';
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
        title: $t('Right.index.572408-4'),
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
        title: $t('Right.index.572408-5'),
        dataIndex: 'action',
        key: 'action',
        scopedSlots: true,
        width: 120
    }
];

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): any[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'update',
            text: $t('Right.index.572408-6'),
            tooltip: {
                title: $t('Right.index.572408-6'),
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
            text: $t('Right.index.572408-7'),
            tooltip: {
                title: $t('Right.index.572408-7'),
            },
            popConfirm: {
                title: $t('Right.index.572408-8'),
                onConfirm: async () => {
                    const res = await deleteDicItem(data.id)
                    if (res.status === 200) {
                        onlyMessage($t('Right.index.572408-9'))
                        tableRef.value.reload()
                    } else {
                        onlyMessage($t('Right.index.572408-10'), 'error')
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    if (type === 'card')
        return actions.filter((i: any) => i.key !== 'view');
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
            sorts: [{ name: 'ordinal', order: 'asc' }],
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
        if (resp.success) {
            const arr = cloneDeep(resp.result.data)
            arr?.sort((a: any, b: any) => {
                return b.ordinal - a.ordinal
            })

            return {
                code: resp.status,
                result: resp.result,
                status: resp.status,
                success: resp.status === 200
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
            success: true
        };
    }
}
watch(() => props?.data?.id, () => {
    tableRef.value.reload()
})
</script>
<style lang="less" scoped>
.des {
  height: 100%;
  overflow-y: auto;
}
.des_head {
    padding: 10px 20px;
    background-color: rgb(242, 242, 242);

    span {
        color: rgb(127, 127, 127)
    }
}
</style>

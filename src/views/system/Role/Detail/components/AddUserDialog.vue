<template>
    <j-modal visible :title="$t('components.AddUserDialog.5299710-0')" width="1000px" @ok="confirm" @cancel="emits('update:visible', false)">
        <!-- <j-advanced-search
            :columns="columns"
            type="simple"
            @search="(params:any)=>queryParams = {...params}"
        /> -->
        <pro-search :columns="columns" target="simple" @search="(params: any) => queryParams = { ...params }" />

        <j-pro-table ref="tableRef" :columns="columns" :request="getUserList" model="TABLE" :params="queryParams"
            :rowSelection="{
                selectedRowKeys: selectedRowKeys,
                onSelect: changeSelect,
                onSelectAll: selectAll,
                onSelectNone: ()=>selectedRowKeys = []
            }">
        </j-pro-table>
    </j-modal>
</template>

<script setup lang="ts">
import { getUserByRole_api, bindUser_api } from '@/api/system/role';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const emits = defineEmits(['refresh', 'update:visible']);
const props = defineProps<{
    visible: boolean;
    roleId: string;
}>();

const columns = [
    {
        title: $t('components.AddUserDialog.5299710-1'),
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('components.AddUserDialog.5299710-2'),
        dataIndex: 'username',
        key: 'username',
        search: {
            type: 'string',
        },
    },
];
const queryParams = ref({});

const selectedRowKeys = ref<any>([]);
const getUserList = (oParams: any) => {
    const params = {
        ...oParams,
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [
            {
                terms: [
                    {
                        column: 'id$in-dimension$role$not',
                        value: props.roleId,
                    },
                    {
                        column: 'username',
                        value: 'admin',
                        termType: 'not',
                        type: 'and'
                    }
                ],
            },
        ],
    };
    if (oParams.terms[0])
        params.terms.unshift({
            terms: oParams.terms[0].terms,
        });
    return getUserByRole_api(params);
};

const confirm = () => {
    if (selectedRowKeys.value.length < 1) {
        onlyMessage($t('components.AddUserDialog.5299710-3'), 'error');
    } else {
        bindUser_api(props.roleId, selectedRowKeys.value).then((resp) => {
            if (resp.status === 200) {
                onlyMessage($t('components.AddUserDialog.5299710-4'));
                emits('refresh');
                emits('update:visible', false);
            }
        });
    }
};
const changeSelect = (item: any, state: boolean) => {
    const arr = new Set(selectedRowKeys.value);
    console.log(item, state);
    if (state) {
        arr.add(item.id);
    } else {
        arr.delete(item.id);
    }
    selectedRowKeys.value = [...arr.values()];
};

const selectAll = (selected: Boolean, selectedRows: any,changeRows:any) => {
    if (selected) {
            changeRows.map((i: any) => {
                if (!selectedRowKeys.value.includes(i.id)) {
                    selectedRowKeys.value.push(i.id)
                }
            })
        } else {
            const arr = changeRows.map((item: any) => item.id)
            const _ids: string[] = [];
            selectedRowKeys.value.map((i: any) => {
                if (!arr.includes(i)) {   
                    _ids.push(i)
                }
            })
            selectedRowKeys.value = _ids
            
        }     
}
</script>

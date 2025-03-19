<template>
    <a-modal visible :title="$t('components.AddUserDialog.659587-0')" width="1000px" @ok="confirm" @cancel="emits('update:visible', false)">
        <pro-search style="padding: 0" :columns="columns" type="simple" @search="(params) => queryParams = { ...params }" />

        <div style="height: 480px;">
          <j-pro-table style="padding: 0" ref="tableRef" :columns="columns" :request="getUserList" mode="TABLE" :params="queryParams"
                       :rowSelection="{
                selectedRowKeys: selectedRowKeys,
                onSelect: changeSelect,
                onSelectAll: selectAll,
                onSelectNone: ()=>selectedRowKeys = []
            }">
          </j-pro-table>
        </div>
    </a-modal>
</template>

<script setup lang="ts" name="RoleAddUser">
import { getUserByRole_api, bindUser_api } from '@/api/system/role';
import { onlyMessage } from '@jetlinks-web/utils';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const emits = defineEmits(['refresh', 'update:visible']);
const props = defineProps<{
    visible: boolean;
    roleId: string;
}>();

const columns = [
    {
        title: $t('components.AddUserDialog.659587-1'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('components.AddUserDialog.659587-2'),
        dataIndex: 'username',
        key: 'username',
        ellipsis: true,
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
        onlyMessage($t('components.AddUserDialog.659587-3'), 'error');
    } else {
        bindUser_api(props.roleId, selectedRowKeys.value).then((resp) => {
            if (resp.status === 200) {
                onlyMessage($t('components.AddUserDialog.659587-4'));
                emits('refresh');
                emits('update:visible', false);
            }
        });
    }
};
const changeSelect = (item: any, state: boolean) => {
    const arr = new Set(selectedRowKeys.value);
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

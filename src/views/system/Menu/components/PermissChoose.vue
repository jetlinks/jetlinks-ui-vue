<template>
    <div class="permission-choose-container">
        <j-input
            v-model:value="searchValue"
            style="width: 300px"
            allowClear
            placeholder="请输入权限名称"
            @input="search.search"
            :disabled="props.disabled"
        />

        <div class="permission-table">
            <j-row :gutter="24" class="table-head">
                <j-col :span="props.firstWidth">权限名称</j-col
                ><j-col :span="24 - props.firstWidth">权限操作</j-col>
            </j-row>
            <div class="table-body" :style="{ 'max-height': props.maxHeight }">
                <j-row
                    :gutter="24"
                    class="row"
                    v-for="rowItem in permission.list"
                >
                    <j-col :span="props.firstWidth" class="item-name">
                        <j-checkbox
                            v-model:checked="rowItem.checkAll"
                            :indeterminate="rowItem.indeterminate"
                            @change="() => permission.selectAllOpions(rowItem)"
                            :disabled="props.disabled"
                        >
                            {{ rowItem.name }}
                        </j-checkbox>
                    </j-col>
                    <j-col :span="24 - props.firstWidth">
                        <j-checkbox-group
                            v-model:value="rowItem.checkedList"
                            :options="rowItem.options"
                            @change="((checkValue:string[])=>permission.selectOption(rowItem, checkValue))"
                            :disabled="props.disabled"
                        />
                    </j-col>
                </j-row>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { exportPermission_api } from '@/api/system/permission';
import { Form } from 'jetlinks-ui-components';
Form.useInjectFormItemContext();

const props = defineProps<{
    key: string;
    value: any[];
    firstWidth: number;
    maxHeight: string;
    disabled?: boolean;
}>();
const emits = defineEmits(['update:value']);
const searchValue = ref<string>('');

const search = reactive({
    searchTimer: null as null | number,
    search: () => {
        if (search.searchTimer) {
            clearTimeout(search.searchTimer);
        }
        search.searchTimer = setTimeout(() => {
            nextTick(() => permission.getList());
            search.searchTimer = null;
        }, 1000);
    },
});
const permission = reactive({
    list: [] as permissionType[],
    sourceList: [] as any[],

    init: () => {
        permission.getList();
        watch(
            () => props.key,
            () => {
                nextTick(() => {
                    permission.list = permission.makeList(
                        props.value,
                        permission.sourceList,
                    );
                });
            },
        );
    },
    // 获取权限列表
    getList: () => {
        const params: paramsType = {
            paging: false,
        };
        if (searchValue.value) {
            params.terms = [
                { column: 'name$like', value: `%${searchValue.value}%` },
            ];
        }
        exportPermission_api(params).then((resp) => {
            permission.sourceList = [...(resp.result as any[])];
            permission.list = permission.makeList(
                props.value,
                resp.result as any[],
            );
        });
    },
    // 全选/取消全选
    selectAllOpions: (row: permissionType) => {
        row.indeterminate = false;
        const newValue = props.value.filter(
            (item) => item.permission !== row.id,
        );
        row = toRaw(row);
        if (row.checkAll) {
            row.checkedList = row.options.map((item) => item.value);

            newValue.push({
                permission: row.id,
                actions: row.checkedList,
            });
        } else {
            row.checkedList = [];
        }
        emits('update:value', newValue);
    },
    // 单选
    selectOption: (row: permissionType, newValue: string[]) => {
        const newProp = props.value.filter(
            (item) => item.permission !== row.id,
        );
        if (newValue.length === row.options.length) {
            row.checkAll = true;
            row.indeterminate = false;
            newProp.push({
                permission: row.id,
                actions: newValue,
            });
        } else if (newValue.length > 0) {
            row.checkAll = false;
            row.indeterminate = true;
            newProp.push({
                permission: row.id,
                actions: newValue,
            });
        }else{
            row.indeterminate = false
        }

        emits('update:value', newProp);
    },
    makeList: (checkedValue: any[], sourceList: any[]): permissionType[] => {
        const result = sourceList.map((item) => {
            const checked = checkedValue?.find(
                (checkedItem) => checkedItem.permission === item.id,
            );

            const options =
            item.actions && item.actions.map((actionItem: any) => ({
                    label: actionItem.name,
                    value: actionItem.action,
                })) || [];
            return {
                id: item.id,
                name: item.name,
                checkedList: (checked && checked.actions) || [],
                checkAll:
                    (checked &&
                        item.actions &&
                        checked.actions.length === item.actions.length) ||
                    false,
                indeterminate:
                    (checked &&
                        item.actions &&
                        checked.actions.length < item.actions.length) ||
                    false,
                options,
            };
        }) as permissionType[];

        return result;
    },
});
permission.init();

type permissionType = {
    id: string;
    name: string;
    checkedList: string[];
    checkAll: boolean;
    indeterminate: boolean;
    options: any[];
};
type paramsType = {
    paging: boolean;
    terms?: object[];
};
</script>

<style lang="less" scoped>
.permission-choose-container {
    .ant-input-affix-wrapper {
        border-color: #d9d9d9 !important;
    }
    .permission-table {
        margin-top: 12px;
        font-size: 14px;
        border: 1px solid #d9d9d9;
        color: rgba(0, 0, 0, 0.85);
        .table-head {
            padding: 12px;
            background-color: #d9d9d9;
            margin: 0 !important;
        }
        .table-body {
            overflow: auto;
            .row {
                margin: 0 !important;

                border-bottom: 1px solid #d9d9d9;

                > div {
                    padding: 8px 12px;
                }
                .item-name {
                    display: flex;
                    align-items: center;
                    border-right: 1px solid #d9d9d9;
                }
            }
        }
    }
}
</style>

<template>
    <a-card class="mangement-container">
        <div class="left">
            <a-input-search
                v-model:value="leftData.searchValue"
                placeholder="请输入"
                style="margin-bottom: 24px"
            />
            <a-tree
                showLine
                autoExpandParent
                :tree-data="leftData.treeData"
                v-model:selectedKeys="leftData.selectedKeys"
                @select="leftData.onSelect"
            >
                <template #title="{ dataRef }">
                    <div
                        v-if="dataRef.root"
                        style="
                            justify-content: space-between;
                            display: flex;
                            align-items: center;
                        "
                    >
                        <span>
                            {{ dataRef.title }}
                        </span>
                        <AIcon
                            type="PlusOutlined"
                            style="color: #1d39c4"
                            @click="leftData.addTable"
                        />
                    </div>
                    <span v-else>
                        {{ dataRef.title }}
                    </span>
                </template>
            </a-tree>
        </div>
        <div class="right">
            <div class="btns">
                <a-button type="primary" @click="table.clickSave"
                    >保存</a-button
                >
            </div>
            <JTable
                ref="tableRef"
                :columns="table.columns"
                model="TABLE"
                :dataSource="table.data"
            >
                <template #previousName="slotProps">
                    <a-input
                        :disabled="slotProps.scale === 0"
                        v-model:value="slotProps.previousName"
                        placeholder="请输入名称"
                    />
                </template>
                <template #type="slotProps">
                    <a-input
                        v-model:value="slotProps.type"
                        placeholder="请输入类型"
                    />
                </template>
                <template #length="slotProps">
                    <a-input-number v-model:value="slotProps.length" />
                </template>
                <template #precision="slotProps">
                    <a-input-number v-model:value="slotProps.precision" />
                </template>
                <template #notnull="slotProps">
                    <a-radio-group
                        v-model:value="slotProps.notnull"
                        button-style="solid"
                    >
                        <a-radio-button :value="true">是</a-radio-button>
                        <a-radio-button :value="false">否</a-radio-button>
                    </a-radio-group>
                </template>
                <template #comment="slotProps">
                    <a-input
                        v-model:value="slotProps.comment"
                        placeholder="请输入说明"
                    />
                </template>
                <template #action="slotProps">
                    <PermissionButton
                        :uhasPermission="`{permission}:delete`"
                        type="link"
                        :tooltip="{ title: '删除' }"
                        :popConfirm="{
                            title: `确认删除`,
                            onConfirm: () => table.clickDel(slotProps),
                        }"
                        :disabled="slotProps.status"
                    >
                        <AIcon type="DeleteOutlined" />
                    </PermissionButton>
                </template>
            </JTable>
            <a-botton class="add-row" @click="table.addRow"
                ><AIcon type="PlusOutlined" /> 新增行</a-botton
            >
        </div>
    </a-card>
    <div class="dialogs">
        <a-modal
            v-model:visible="dialog.visible"
            title="新增"
            @ok="dialog.handleOk"
        >
            <a-form :model="dialog.form" ref="addFormRef">
                <a-form-item
                    label="名称"
                    name="name"
                    :rules="[
                        {
                            required: true,
                            message: '请输入名称',
                            trigger: 'change',
                        },
                        {
                            max: 64,
                            message: '最多可输入64个字符',
                            trigger: 'change',
                        },
                        {
                            pattern: /^[0-9].*$/,
                            message: '不能以数字开头',
                            trigger: 'change',
                        },
                        {
                            pattern: /^\w+$/,
                            message: '名称只能由数字、字母、下划线、中划线组成',
                            trigger: 'change',
                        },
                    ]"
                >
                    <a-input
                        v-model:value="dialog.form.name"
                        placeholder="请输入名称"
                    />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup lang="ts" name="Management">
import {
    getDataSourceInfo_api,
    rdbTree_api,
    rdbTables_api,
    saveTable_api,
} from '@/api/system/dataSource';
import { FormInstance, message } from 'ant-design-vue';
import { DataNode } from 'ant-design-vue/lib/tree';
import { dictItemType, sourceItemType } from '../typing';

const id = useRoute().query.id as string;

const info = reactive({
    data: {} as sourceItemType,
    init: () => {
        id &&
            getDataSourceInfo_api(id).then((resp: any) => {
                info.data = resp.result;
            });
    },
});

const leftData = reactive({
    searchValue: '',
    sourceTree: [] as dictItemType[],
    treeData: [] as DataNode[],
    selectedKeys: [] as string[],
    oldKey: '',

    init: () => {
        leftData.getTree();
        watch(
            [
                () => leftData.searchValue,
                () => leftData.sourceTree,
                () => info.data,
            ],
            (n) => {
                if (leftData.sourceTree.length < 1 || !info.data.shareConfig)
                    return;
                let filterArr = [];
                if (leftData.searchValue) {
                    filterArr = leftData.sourceTree.filter((item) =>
                        item.name.includes(n[0]),
                    );
                } else filterArr = leftData.sourceTree;
                leftData.treeData = [
                    {
                        title: info.data.shareConfig.schema,
                        key: info.data.shareConfig.schema,
                        root: true,
                        children: filterArr.map((item) => ({
                            title: item.name,
                            key: item.name,
                        })),
                    },
                ];
                leftData.selectedKeys = [filterArr[0].name];
                leftData.onSelect([filterArr[0].name]);
            },
            {},
        );
    },
    getTree: () => {
        rdbTree_api(id)
            .then((resp: any) => {
                leftData.sourceTree = resp.result;
            })
            .catch(() => {});
    },
    onSelect: (selectedKeys: string[], e?: any) => {
        if (e?.node?.root) {
            leftData.selectedKeys = [leftData.oldKey];
            return;
        }
        leftData.oldKey = selectedKeys[0];
        const key = selectedKeys[0];
        table.getTabelData(key);
    },
    addTable: (e: Event) => {
        e.stopPropagation();
    },
});

const table = reactive({
    columns: [
        {
            title: '列名',
            dataIndex: 'previousName',
            key: 'previousName',
            scopedSlots: true,
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            scopedSlots: true,
        },
        {
            title: '长度',
            dataIndex: 'length',
            key: 'length',
            scopedSlots: true,
        },
        {
            title: '精度',
            dataIndex: 'precision',
            key: 'precision',
            scopedSlots: true,
        },
        {
            title: '不能为空',
            dataIndex: 'notnull',
            key: 'notnull',
            scopedSlots: true,
        },
        {
            title: '说明',
            dataIndex: 'comment',
            key: 'comment',
            scopedSlots: true,
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            scopedSlots: true,
        },
    ],
    data: [] as any,

    getTabelData: (key: string) => {
        rdbTables_api(id, key).then((resp: any) => {
            table.data = resp.result.columns;
        });
    },
    addRow: () => {
        table.data.push({
            precision: 0,
            length: 0,
            notnull: false,
        });
    },
    clickSave: () => {
        const params = {
            name: leftData.selectedKeys[0],
            columns: table.data,
        };
        saveTable_api(id, params).then(() => {
            table.getTabelData(params.name);
        });
    },
    clickDel: (row: any) => {},
});

const addFormRef = ref<FormInstance >();
const dialog = reactive({
    visible: false,
    form: {
        name: '',
    },
    handleOk: () => {
        addFormRef.value && addFormRef.value.validate().then(()=>{
            const name = dialog.form.name
            leftData.sourceTree.unshift({
                id:name,
                name
            })
            leftData.oldKey = name;
            leftData.selectedKeys = [name]
            table.data = []
        })
    },
});

init();
function init() {
    info.init();
    leftData.init();
}
</script>

<style lang="less" scoped>
.mangement-container {
    padding: 24px;
    background-color: transparent;
    :deep(.ant-card-body) {
        display: flex;
        background-color: #fff;

        .left {
            flex-basis: 280px;
            padding-right: 24px;
            box-sizing: border-box;

            .ant-tree-treenode {
                width: 100%;
                .ant-tree-switcher-noop {
                    display: none;
                }
                .ant-tree-node-content-wrapper {
                    width: 100%;
                    .ant-tree-title {
                        width: 100%;
                    }
                }
                &:first-child .ant-tree-node-selected {
                    background-color: transparent;
                }
            }
        }
        .right {
            width: calc(100% - 280px);
            box-sizing: border-box;
            border-left: 1px solid #f0f0f0;

            .btns {
                display: flex;
                justify-content: right;
                padding: 0px 24px;
            }

            .add-row {
                display: block;
                text-align: center;
                width: 100%;
                cursor: pointer;
            }
        }
    }
}
</style>

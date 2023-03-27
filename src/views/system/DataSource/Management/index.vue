<template>
    <page-container>
        <div class="manager-container">
            <div class="left">
                <j-input-search
                    v-model:value="leftData.searchValue"
                    placeholder="请输入"
                    style="margin-bottom: 24px"
                />
                <!-- 使用v-if用于解决异步加载数据后不展开的问题 -->
                <j-tree
                    v-if="leftData.treeData.length > 0"
                    showLine
                    defaultExpandAll
                    :tree-data="leftData.treeData"
                    v-model:selectedKeys="leftData.selectedKeys"
                    @select="onSelect"
                >
                    <template #title="{ dataRef }">
                        <div
                            v-if="dataRef.root"
                            style="
                                justify-content: space-between;
                                display: flex;
                                align-items: center;
                                width: 200px;
                            "
                        >
                            <span>
                                {{ dataRef.title }}
                            </span>
                            <AIcon
                                type="PlusOutlined"
                                style="color: #1d39c4"
                                @click="addTable"
                            />
                        </div>
                        <span v-else>
                            {{ dataRef.title }}
                        </span>
                    </template>
                </j-tree>
            </div>
            <div class="right">
                <div class="btns">
                    <j-button type="primary" @click="clickSave">保存</j-button>
                </div>
                <j-form ref="formRef" :model="table">
                    <j-table
                        :columns="columns"
                        :dataSource="table.data"
                        :pagination="false"
                        :scroll="{ y: 500 }"
                    >
                        <template #bodyCell="{ column, record, index }">
                            <template v-if="column.key === 'name'">
                                <j-form-item
                                    :name="['data', index, 'name']"
                                    :rules="[
                                        {
                                            max: 64,
                                            message: '最多可输入64个字符',
                                        },
                                        {
                                            required: true,
                                            message: '请输入名称',
                                        },
                                    ]"
                                >
                                    <j-input
                                        :disabled="record.scale !== undefined"
                                        v-model:value="record.name"
                                        placeholder="请输入名称"
                                    />
                                </j-form-item>
                            </template>
                            <template v-else-if="column.key === 'type'">
                                <j-form-item
                                    :name="['data', index, 'type']"
                                    :rules="[
                                        {
                                            max: 64,
                                            message: '最多可输入64个字符',
                                        },
                                        {
                                            required: true,
                                            message: '请输入类型',
                                        },
                                    ]"
                                >
                                    <j-input
                                        v-model:value="record.type"
                                        placeholder="请输入类型"
                                    />
                                </j-form-item>
                            </template>
                            <template v-else-if="column.key === 'length'">
                                <j-form-item :name="['data', index, 'length']">
                                    <j-input-number
                                        v-model:value="record.length"
                                        :min="0"
                                        :max="99999"
                                        style="width: 100%"
                                    />
                                </j-form-item>
                            </template>
                            <template v-else-if="column.key === 'precision'">
                                <j-form-item
                                    :name="['data', index, 'precision']"
                                >
                                    <j-input-number
                                        v-model:value="record.precision"
                                        :min="0"
                                        :max="99999"
                                        style="width: 100%"
                                    />
                                </j-form-item>
                            </template>
                            <template v-else-if="column.key === 'notnull'">
                                <j-form-item :name="['data', index, 'notnull']">
                                    <j-radio-group
                                        v-model:value="record.notnull"
                                        button-style="solid"
                                    >
                                        <j-radio-button :value="true"
                                            >是</j-radio-button
                                        >
                                        <j-radio-button :value="false"
                                            >否</j-radio-button
                                        >
                                    </j-radio-group>
                                </j-form-item>
                            </template>
                            <template v-else-if="column.key === 'comment'">
                                <j-form-item :name="['data', index, 'notnull']">
                                    <j-input
                                        v-model:value="record.comment"
                                        placeholder="请输入说明"
                                    />
                                </j-form-item>
                            </template>
                            <template v-else-if="column.key === 'action'">
                                <PermissionButton
                                    hasPermission="system/DataSource:delete"
                                    type="link"
                                    :tooltip="{ title: '删除' }"
                                    :danger="true"
                                    :popConfirm="{
                                        title: `确认删除`,
                                        onConfirm: () => clickDel(record),
                                    }"
                                    :disabled="record.status"
                                >
                                    <AIcon type="DeleteOutlined" />
                                </PermissionButton>
                            </template>
                        </template>
                    </j-table>
                </j-form>

                <j-button class="add-row" @click="addRow">
                    <AIcon type="PlusOutlined" /> 新增行
                </j-button>
            </div>
        </div>
        <j-modal
            :visible="true"
            v-if="dialog.visible"
            title="新增"
            @ok="handleOk"
            @cancel="handleCancel"
        >
            <j-form :model="dialog.form" ref="addFormRef" :layout="'vertical'">
                <j-form-item
                    label="名称"
                    name="name"
                    :required="true" 
                    :rules="[
                        // {
                        //     required: true,
                        //     message: '请输入名称',
                        // },
                        {
                            max: 64,
                            message: '最多可输入64个字符',
                            trigger: 'change',
                        },
                        {
                            // pattern: /^[0-9].*$/,
                            // message: '不能以数字开头',
                            trigger: 'change',
                            validator: checkName,
                        },
                        {
                            pattern: /^\w+$/,
                            message: '名称只能由数字、字母、下划线、中划线组成',
                            trigger: 'change',
                        },
                    ]"
                >
                    <j-input
                        v-model:value="dialog.form.name"
                        placeholder="请输入名称"
                    />
                </j-form-item>
            </j-form>
        </j-modal>
    </page-container>
</template>

<script setup lang="ts" name="Management">
import {
    getDataSourceInfo_api,
    rdbTree_api,
    rdbTables_api,
    saveTable_api,
    delSaveRow_api,
} from '@/api/system/dataSource';
import { onlyMessage } from '@/utils/comm';
import { FormInstance, message } from 'ant-design-vue';
import { DataNode } from 'ant-design-vue/lib/tree';
import _ from 'lodash';
import { cloneDeep } from 'lodash';
import type { dbColumnType, dictItemType, sourceItemType } from '../typing';

const id = useRoute().query.id as string;

const columns = [
    {
        title: '列名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: '长度',
        dataIndex: 'length',
        key: 'length',
    },
    {
        title: '精度',
        dataIndex: 'precision',
        key: 'precision',
    },
    {
        title: '不能为空',
        dataIndex: 'notnull',
        key: 'notnull',
    },
    {
        title: '说明',
        dataIndex: 'comment',
        key: 'comment',
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
    },
];
const formRef = ref();

const getInfo = (_id: string) => {
    getDataSourceInfo_api(_id).then((resp: any) => {
        info.data = resp.result;
    });
};

const info = reactive({
    data: {} as sourceItemType,
});

const leftData = reactive({
    searchValue: '',
    sourceTree: [] as dictItemType[],
    treeData: [] as any[],
    selectedKeys: [] as string[],
    oldKey: '',
});

const queryTables = (key: string) => {
    if (key) {
        rdbTables_api(id, key).then((resp: any) => {
            table.data = resp.result.columns.map(
                (item: object, index: number) => ({
                    ...item,
                    index,
                }),
            );
        });
    }
};

const handleSearch = (refresh?: boolean) => {
    rdbTree_api(id)
        .then((resp: any) => {
            if (resp.status === 200) {
                leftData.sourceTree = resp.result;
                if (refresh) {
                    leftData.selectedKeys = [resp.result[0]?.name];
                    queryTables(resp.result[0]?.name);
                } else {
                    queryTables(leftData.selectedKeys[0]);
                }
            }
        })
        .catch(() => {});
};

const onSelect = (selectedKeys: string[], e?: any) => {
    if (e?.node?.root) {
        leftData.selectedKeys = [leftData.oldKey];
        return;
    }
    if (!selectedKeys[0]) {
        return;
    }
    leftData.oldKey = selectedKeys[0];
    const key = selectedKeys[0];
    queryTables(key);
};

const addTable = (e: Event) => {
    e?.stopPropagation();
    dialog.visible = true;
};

watch(
    () => id,
    (newId) => {
        if (newId) {
            getInfo(newId);
            handleSearch(true);
        }
    },
    {
        immediate: true,
    },
);

const table = reactive({
    data: [] as dbColumnType[],
});

const addRow = () => {
    const initData: dbColumnType = {
        precision: 0,
        length: 0,
        notnull: false,
        type: '',
        comment: '',
        name: '',
    };
    table.data.push(initData);
};

const clickDel = (row: any) => {
    if (row.scale !== undefined) {
        delSaveRow_api(id, leftData.selectedKeys[0], [row.name]).then(
            (resp: any) => {
                if (resp.status === 200) table.data.splice(row.index, 1);
            },
        );
    } else table.data.splice(row.index, 1);
};

const clickSave = () => {
    formRef.value.validate().then((_data: any) => {
        const columns = cloneDeep(table.data);
        columns.forEach((item) => delete item.index);
        if (!columns.length) {
            onlyMessage('请配置数据源字段', 'error');
            return;
        }
        const params = {
            name: leftData.selectedKeys[0],
            columns,
        };
        saveTable_api(id, params).then((resp) => {
            if (resp.status === 200) {
                message.success('操作成功');
                queryTables(params.name);
            }
        });
    });
};

const addFormRef = ref<FormInstance>();
const dialog = reactive({
    visible: false,
    form: {
        name: '',
    },
});

const handleOk = () => {
    addFormRef.value &&
        addFormRef.value.validate().then(() => {
            const name = dialog.form.name;
            leftData.sourceTree.unshift({
                id: name,
                name,
            });
            leftData.oldKey = name;
            leftData.selectedKeys = [name];
            table.data = [];
            dialog.visible = false;
            addFormRef.value?.resetFields();
        });
};

const handleCancel = () => {
    dialog.visible = false;
    addFormRef.value?.resetFields();
};

watch(
    [() => leftData.searchValue, () => leftData.sourceTree],
    ([m, n]) => {
        if (!!m) {
            const list = n.filter((item) => {
                return item.name.includes(m);
            });
            leftData.treeData = [
                {
                    title: info.data.shareConfig.schema,
                    key: info.data.shareConfig.schema,
                    root: true,
                    children: list.map((item) => ({
                        title: item.name,
                        key: item.name,
                    })),
                },
            ];
            if (!_.map(list, 'name').includes(leftData.selectedKeys[0])) {
                leftData.selectedKeys = [list[0]?.name];
                queryTables(list[0]?.name);
            }
        } else {
            leftData.treeData = [
                {
                    title: info.data.shareConfig.schema,
                    key: info.data.shareConfig.schema,
                    root: true,
                    children: leftData.sourceTree.map((item) => ({
                        title: item.name,
                        key: item.name,
                    })),
                },
            ];
        }
    },
    { deep: true },
);

const checkName = (_: any, value: any) =>
    new Promise((resolve, reject) => {
        if (value) {
            const first = value.slice(0, 1);
            if (typeof Number(first) === 'number' && !isNaN(Number(first))) {
                reject('不能以数字开头');
            } else {
                resolve('');
            }
        } else {
            reject('请输入名称');
        }
    });
</script>

<style lang="less" scoped>
.manager-container {
    padding: 24px;
    background-color: #fff;
    display: flex;
    min-height: 500px;

    .left {
        flex-basis: 280px;
        padding: 0 24px;
        box-sizing: border-box;
    }
    .right {
        width: calc(100% - 280px);
        box-sizing: border-box;
        border-left: 1px solid #f0f0f0;
        padding-left: 24px;

        .btns {
            display: flex;
            justify-content: right;
        }

        .add-row {
            display: block;
            text-align: center;
            width: 100%;
            margin: 24px 0;
            cursor: pointer;
        }

        .ant-form-item {
            margin-bottom: 0;
        }
    }
}
</style>

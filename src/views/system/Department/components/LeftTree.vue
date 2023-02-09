<template>
    <div class="left-tree-container">
        <a-input
            v-model:value="searchValue"
            @change="search"
            placeholder="请输入组织名称"
            class="search-input"
        >
            <template #suffix>
                <search-outlined />
            </template>
        </a-input>
        <a-button type="primary" @click="openDialog" class="add-btn">
            新增
        </a-button>
        <a-tree
            :tree-data="treeData"
            v-model:selected-keys="selectedKeys"
            :fieldNames="{ key: 'id' }"
            v-loading="loading"
        >
            <template #title="{ name, data }">
                <span>{{ name }}</span>
                <span class="func-btns">
                    <a-tooltip>
                        <template #title>编辑</template>
                        <a-button style="padding: 0" type="link">
                            <edit-outlined @click="openDialog(data)" />
                        </a-button>
                    </a-tooltip>
                    <a-tooltip>
                        <template #title>新增子组织</template>
                        <a-button style="padding: 0" type="link">
                            <plus-circle-outlined
                                style="margin: 0 8px"
                                @click="
                                    openDialog({
                                        ...data,
                                        id: '',
                                        parentId: data.id,
                                    })
                                "
                            />
                        </a-button>
                    </a-tooltip>

                    <a-popconfirm
                        title="确认删除"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="delDepartment(data.id)"
                    >
                        <a-tooltip>
                            <template #title>删除</template>
                            <a-button style="padding: 0" type="link">
                                <delete-outlined />
                            </a-button>
                        </a-tooltip>
                    </a-popconfirm>
                </span>
            </template>
        </a-tree>

        <!-- 编辑弹窗 -->
        <EditDepartmentDialog
            :tree-data="sourceTree"
            ref="editDialogRef"
            @refresh="getTree"
        />
    </div>
</template>

<script setup lang="ts">
import { getTreeData_api, delDepartment_api } from '@/api/system/department';
import { debounce, cloneDeep, omit } from 'lodash-es';
import { ArrayToTree } from '@/utils/utils';
import EditDepartmentDialog from './EditDepartmentDialog.vue';

import {
    SearchOutlined,
    EditOutlined,
    PlusCircleOutlined,
    DeleteOutlined,
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

const emits = defineEmits(['change']);
const searchValue = ref('');// 搜索内容
const loading = ref<boolean>(false); // 数据加载状态
const sourceTree = ref<any[]>([]); // 源数据
const treeMap = new Map(); // 数据的map版本
const treeData = ref<any[]>([]); // 展示的数据
const selectedKeys = ref<string[]>([]); // 当前选中的项

getTree();
watch(selectedKeys, (n) => {
    emits('change', n[0]);
});

function getTree() {
    loading.value = true;
    const params = {
        paging: false,
        sorts: [{ name: 'sortIndex', order: 'asc' }],
    } as any;
    if (searchValue.value) {
        params.terms = [
            { column: 'name$LIKE', value: `%${searchValue.value}%` },
        ];
    }

    getTreeData_api(params)
        .then((resp: any) => {
            selectedKeys.value = [resp.result[0].id];
            sourceTree.value = resp.result; // 报存源数据
            handleTreeMap(resp.result); // 将树形结构转换为map结构
            treeData.value = resp.result; // 第一次不用进行过滤
        })
        .finally(() => {
            loading.value = false;
        });
};
const search = debounce(() => {
    const key = searchValue.value;
    const treeArray = new Map();
    if (key) {
        const searchTree: string[] = [];
        treeMap.forEach((item) => {
            if (item.name.includes(key)) {
                searchTree.push(item.parentId);
                treeArray.set(item.id, item);
            }
        });
        dig(searchTree);
        treeData.value = ArrayToTree(cloneDeep([...treeArray.values()]));
    } else {
        treeData.value = ArrayToTree(cloneDeep([...treeMap.values()]));
    }

    function dig(_data: any[]): any {
        const pIds: string[] = [];
        if (!_data.length) return;
        _data.forEach((item) => {
            if (treeMap.has(item)) {
                const _item = treeMap.get(item);
                pIds.push(_item.parentId);
                treeArray.set(item, _item);
            }
        });
    }
}, 500);
// 将树形数组转化为map形式，以便筛选时操作
function handleTreeMap(_data: any[]) {
    if (_data) {
        _data.map((item) => {
            treeMap.set(item.id, omit(cloneDeep(item), ['children']));
            if (item.children) {
                handleTreeMap(item.children);
            }
        });
    }
}
// 删除部门
function delDepartment(id: string) {
    delDepartment_api(id).then(() => {
        message.success('操作成功');
        getTree();
    });
}


// 弹窗
const editDialogRef = ref(); // 新增弹窗实例
const openDialog = (row: any = {}) => {
    editDialogRef.value.openDialog(true, row);
};

</script>

<style lang="less" scoped>
.left-tree-container {
    padding-right: 24px;

    .add-btn {
        margin: 24px 0;
        width: 100%;
    }

    :deep(.ant-tree-treenode) {
        width: 100%;
        .ant-tree-node-content-wrapper {
            flex: 1 1 auto;

            .ant-tree-title {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .func-btns {
                    display: none;
                    font-size: 14px;
                    .ant-btn {
                        height: 22px;
                    }
                }
                &:hover {
                    .func-btns {
                        display: block;
                    }
                }
            }
        }
    }
}
</style>

<template>
    <div class="left-tree-container">
        <j-input
            v-model:value="searchValue"
            @change="search"
            placeholder="请输入车辆"
            class="search-input"
            allowClear
        >
            <template #suffix>
                <AIcon type="SearchOutlined" />
            </template>
        </j-input>
        <div class="add-btn">
            <PermissionButton
                type="primary"
                class="add-btn"
                :hasPermission="`${permission}:add`"
                @click="openDialog()"
            >
                新增分组
            </PermissionButton>
        </div>

        <div class="tree">
            <j-spin :spinning="loading">
                <jTree
                    v-if="treeData.length > 0"
                    :tree-data="treeData"
                    v-model:selected-keys="selectedKeys"
                    v-model:expandedKeys="expandedKeys"
                    :fieldNames="{ key: 'id' }"
                    :showLine="{ showLeafIcon: false }"
                    :show-icon="true"
                >
                    <template #title="{ name, data }">
                        <div class="tree-item-content">
                            <span class="title">
                                <j-ellipsis>
                                    {{ name }}
                                </j-ellipsis>
                            </span>
                            <span
                                class="func-btns"
                                @click="(e) => e.stopPropagation()"
                            >
                                <PermissionButton
                                    :hasPermission="`${permission}:update`"
                                    type="link"
                                    :tooltip="{
                                        title: '编辑',
                                    }"
                                    @click="openDialog(data)"
                                >
                                    <AIcon type="EditOutlined" />
                                </PermissionButton>
                                <PermissionButton
                                    :hasPermission="`${permission}:add`"
                                    type="link"
                                    :tooltip="{
                                        title: '新增子分类',
                                    }"
                                    @click="
                                        openDialog({
                                            ...data,
                                            id: '',
                                            parentId: data.id,
                                        })
                                    "
                                >
                                    <AIcon type="PlusCircleOutlined" />
                                </PermissionButton>
                                <PermissionButton
                                    type="link"
                                    :hasPermission="`${permission}:delete`"
                                    :tooltip="{ title: '删除' }"
                                    :popConfirm="{
                                        title: `确定要删除吗`,
                                        onConfirm: () => delDepartment(data.id),
                                    }"
                                >
                                    <AIcon type="DeleteOutlined" />
                                </PermissionButton>
                            </span>
                        </div>
                    </template>
                </jTree>
                <j-empty v-else description="暂无数据" />
            </j-spin>
        </div>
    </div>
</template>

<script setup lang="ts">
import PermissionButton from '@/components/PermissionButton/index.vue';
import { getTreeData_api } from '@/api/system/department';
import { debounce, cloneDeep, omit } from 'lodash-es';
import { ArrayToTree } from '@/utils/utils';
import { onlyMessage } from '@/utils/comm';

const permission = 'system/Department';

const save = useRoute().query.save;
const emits = defineEmits(['change']);
const searchValue = ref(''); // 搜索内容
const loading = ref<boolean>(false); // 数据加载状态
const sourceTree = ref<any[]>([]); // 源数据
const treeMap = new Map(); // 数据的map版本
const treeData = ref<any[]>([]); // 展示的数据
const selectedKeys = ref<any[]>([]); // 当前选中的项
const expandedKeys = ref<any[]>([]);

const getData = [
    {
        name: '分组一',
        parentId: '',
        sortIndex: 1,
        level: 1,
        creatorId: '1199596756811550720',
        createTime: 1716807986309,
        id: 'fd8470b9-21a9-4ff7-95e6-d3aef0b026c3',
        memberCount: 0,
        children: [
            {
                name: '车辆1',
                parentId: 'fd8470b9-21a9-4ff7-95e6-d3aef0b026c3',
                sortIndex: 1,
                level: 2,
                creatorId: '1199596756811550720',
                createTime: 1718864846551,
                id: '2080f5d1-bb8c-4d14-a303-7554a23e8162',
                memberCount: 0,
            },
        ],
    },
    {
        name: '分组二',
        parentId: '',
        sortIndex: 2,
        level: 1,
        creatorId: '1199596756811550722',
        createTime: 1716807986309,
        id: 'fd8470b9-21a9-4ff7-95e6-d3aef0b026c2',
        memberCount: 0,
        children: [
            {
                name: '车辆21',
                parentId: 'fd8470b9-21a9-4ff7-95e6-d3aef0b026c2',
                sortIndex: 1,
                level: 2,
                creatorId: '1199596756811550720',
                createTime: 1718864846551,
                id: '2080f5d1-bb8c-4d14-a303-7554a23e8163',
                memberCount: 0,
            },
            {
                name: '车辆22',
                parentId: 'fd8470b9-21a9-4ff7-95e6-d3aef0b026c2',
                sortIndex: 2,
                level: 2,
                creatorId: '1199596756811550720',
                createTime: 1718864846551,
                id: '2080f5d1-bb8c-4d14-a303-7554a23e8121',
                memberCount: 0,
            },
            {
                name: '车辆23',
                parentId: 'fd8470b9-21a9-4ff7-95e6-d3aef0b026c2',
                sortIndex: 2,
                level: 2,
                creatorId: '1199596756811550720',
                createTime: 1718864846551,
                id: '2080f5d1-bb8c-4d14-a303-7554a23e3333',
                memberCount: 0,
            },
            {
                name: '车辆24',
                parentId: 'fd8470b9-21a9-4ff7-95e6-d3aef0b026c2',
                sortIndex: 2,
                level: 2,
                creatorId: '1199596756811550720',
                createTime: 1718864846551,
                id: '2080f5d1-bb8c-4d14-a303-7554a23e8234',
                memberCount: 0,
            },
            {
                name: '车辆25',
                parentId: 'fd8470b9-21a9-4ff7-95e6-d3aef0b026c2',
                sortIndex: 2,
                level: 2,
                creatorId: '1199596756811550720',
                createTime: 1718864846551,
                id: '2080f5d1-bb8c-4d14-a303-7554a23e8155',
                memberCount: 0,
            },
            {
                name: '车辆26',
                parentId: 'fd8470b9-21a9-4ff7-95e6-d3aef0b026c2',
                sortIndex: 2,
                level: 2,
                creatorId: '1199596756811550720',
                createTime: 1718864846551,
                id: '2080f5d1-bb8c-4d14-a303-7554a23e8166',
                memberCount: 0,
            },
            {
                name: '车辆27',
                parentId: 'fd8470b9-21a9-4ff7-95e6-d3aef0b026c2',
                sortIndex: 2,
                level: 2,
                creatorId: '1199596756811550720',
                createTime: 1718864846551,
                id: '2080f5d1-bb8c-4d14-a303-7554a23e8177',
                memberCount: 0,
            },
            {
                name: '车辆28',
                parentId: 'fd8470b9-21a9-4ff7-95e6-d3aef0b026c2',
                sortIndex: 2,
                level: 2,
                creatorId: '1199596756811550720',
                createTime: 1718864846551,
                id: '2080f5d1-bb8c-4d14-a303-7554a23e8187',
                memberCount: 0,
            },
        ],
    },
];

function getTree(cb?: Function) {
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
    treeMap.clear();
    getTreeData_api(params)
        .then((resp: any) => {
            sourceTree.value = getData.sort((a: any, b: any) =>
                a.sortIndex === b.sortIndex
                    ? b.createTime - a.createTime
                    : a.sortIndex - b.sortIndex,
            ); // 报存源数据
            selectedKeys.value = [getData[0]?.id];
            handleTreeMap(getData); // 将树形结构转换为map结构
            treeData.value = getData; // 第一次不用进行过滤
            cb && cb();
        })
        .finally(() => {
            loading.value = false;
        });
}
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
        expandedKeys.value = [];
        dig(searchTree);
        treeData.value = ArrayToTree(cloneDeep([...treeArray.values()]));
    } else {
        treeData.value = ArrayToTree(cloneDeep([...treeMap.values()]));
        expandedKeys.value = [];
    }

    function dig(_data: any[]): any {
        const pIds: string[] = [];
        if (!_data.length) return;
        _data.forEach((item) => {
            if (treeMap.has(item)) {
                const _item = treeMap.get(item);
                pIds.push(_item.parentId);
                treeArray.set(item, _item);
                expandedKeys.value.push(_item.id);
                if (pIds.length > 0) {
                    dig(pIds);
                }
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
    onlyMessage('操作成功');
    getTree();
}
function refresh(id: string) {
    getTree();
}

// 弹窗
const dialog = reactive({
    visible: false,
    selectItem: {},
});
const openDialog = (row: any = {}) => {
    // 计算默认排序值，为子列表中最大的排序值+1
    let sortIndex = row.sortIndex || 1;
    if (!row.id) {
        let children = [] as any[];
        if (row.parentId) {
            children = row.children;
        } else children = treeData.value;
        const index =
            children?.length > 0
                ? children?.map((item) => item.sortIndex)
                : [0];
        sortIndex = Math.max(...index) + 1;
    }

    dialog.selectItem = { ...row, sortIndex };
    dialog.visible = true;
};

const init = () => {
    getTree(save ? openDialog : undefined);
    watch(selectedKeys, (n) => {
        emits('change', n[0]);
    });
};

init();
</script>

<style lang="less" scoped>
.left-tree-container {
    padding-right: 24px;
    display: flex;
    height: 100%;
    flex-direction: column;

    .add-btn {
        margin: 24px 0;

        :deep(.ant-btn-primary) {
            width: 100%;
        }
    }
    :deep(.ant-tree-treenode) {
        width: 100%;
        .ant-tree-node-content-wrapper {
            flex: 1 1 auto;

            .ant-tree-title {
                &:hover {
                    .func-btns {
                        display: block;
                    }
                }
            }
        }
    }

    .tree {
        overflow-y: auto;
        overflow-x: auto;
        flex: 1 1 auto;
        .tree-item-content {
            display: flex;
            align-items: stretch;

            .title {
                flex: 1;
                min-width: 80px;
                margin-right: 80px;
            }
            .func-btns {
                display: none;
                font-size: 14px;
                width: 80px;
                margin-left: -80px;
                :deep(.ant-btn-link) {
                    padding: 0 4px;
                    height: 24px;
                }
            }
        }

        .loading {
            display: flex;
            width: 100%;
            justify-content: center;
            margin-top: 20px;
        }
    }
}
</style>

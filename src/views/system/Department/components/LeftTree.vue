<template>
    <div class="left-tree-container">
        <j-input
            v-model:value="searchValue"
            @change="search"
            placeholder="请输入组织名称"
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
                新增
            </PermissionButton>
        </div>

        <div class="tree">
          <j-spin :spinning='loading'>
              <jTree
                  v-if="treeData.length > 0"
                  :tree-data="treeData"
                  v-model:selected-keys="selectedKeys"
                  v-model:expandedKeys="expandedKeys"
                  :fieldNames="{ key: 'id' }"
              >
                  <template #title="{ name, data }">
                    <div class='department-tree-item-content'>
                      <span class='title'>
                        <j-ellipsis>
                          {{ name }}
                        </j-ellipsis>
                      </span>
                      <span class="func-btns" @click="(e) => e.stopPropagation()">
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
                                  title: '新增子组织',
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
        <!-- 编辑弹窗 -->
        <EditDepartmentDialog
            v-if="dialog.visible"
            v-model:visible="dialog.visible"
            :tree-data="sourceTree"
            :data="dialog.selectItem"
            @refresh="refresh"
        />
    </div>
</template>

<script setup lang="ts">
import PermissionButton from '@/components/PermissionButton/index.vue';
import { getTreeData_api, delDepartment_api } from '@/api/system/department';
import { debounce, cloneDeep, omit } from 'lodash-es';
import { ArrayToTree } from '@/utils/utils';
import EditDepartmentDialog from './EditDepartmentDialog.vue';

import { message } from 'jetlinks-ui-components';

const permission = 'system/Department';

const save = useRoute().query.save;
const emits = defineEmits(['change']);
const searchValue = ref(''); // 搜索内容
const loading = ref<boolean>(false); // 数据加载状态
const sourceTree = ref<any[]>([]); // 源数据
const treeMap = new Map(); // 数据的map版本
const treeData = ref<any[]>([]); // 展示的数据
const selectedKeys = ref<string[]>([]); // 当前选中的项
const expandedKeys = ref<string[] | number[]>([]);

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
    treeMap.clear()
    getTreeData_api(params)
        .then((resp: any) => {
            selectedKeys.value = [resp.result[0].id];
            sourceTree.value = resp.result.sort((a: any, b: any) =>
                a.sortIndex === b.sortIndex
                    ? b.createTime - a.createTime
                    : a.sortIndex - b.sortIndex,
            ); // 报存源数据
            handleTreeMap(resp.result); // 将树形结构转换为map结构
            treeData.value = resp.result; // 第一次不用进行过滤
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
function refresh(id: string) {
    // @ts-ignore
    window?.onTabSaveSuccess && window.onTabSaveSuccess(id);
    setTimeout(() => window.close(), 300);
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
        let childrens = [] as any[];
        if (row.parentId) {
            childrens = row.children;
        } else childrens = treeData.value;
        const indexs =
            childrens?.length > 0
                ? childrens?.map((item) => item.sortIndex)
                : [0];
        sortIndex = Math.max(...indexs) + 1;
    }

    dialog.selectItem = { ...row, sortIndex };
    dialog.visible = true;
};

const init = () => {
    getTree(save ? openDialog : undefined);
    watch(selectedKeys, (n) => {
        emits('change', n[0]);
    });
}

init();
</script>

<style lang="less" scoped>
.left-tree-container {
    padding-right: 24px;
    border-right: 1px solid #f0f0f0;
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
      overflow-x: hidden;

      .department-tree-item-content {
        display: flex;
        align-items: center;

        .title {
          width: calc(100% - 80px);
        }
        .func-btns {
          display: none;
          font-size: 14px;
          width: 80px;
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

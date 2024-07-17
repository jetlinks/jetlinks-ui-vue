<template>
    <div class="left-contain">
        <j-input
            placeholder="字典名称"
            v-model:value="searchValue"
            @pressEnter="search"
            @change="searchChange"
        >
            <template #suffix>
                <AIcon type="SearchOutlined" @click="search" />
            </template>
        </j-input>
        <div class="controls">
            <PermissionButton
                type="primary"
                hasPermission="system/Dictionary:add"
                @click="showSave"
                style="width: 160px"
            >
                新增字典
            </PermissionButton>
            <PermissionButton
                type="text"
                hasPermission="system/Dictionary:down"
                @click="downVisible = true"
            >
                下载
            </PermissionButton>
            <j-upload
                :before-upload="beforeUpload"
                accept=".json"
                :show-upload-list="false"
                :disabled="!hasPermission('system/Dictionary:import')"
            >
                <PermissionButton
                    type="text"
                    hasPermission="system/Dictionary:import"
                >
                    导入
                </PermissionButton>
            </j-upload>
        </div>
        <div class="tree">
            <j-tree
                :tree-data="listData"
                v-if="listData.length"
                :fieldNames="{ title: 'name', key: 'id' }"
                blockNode
                :selectedKeys="selectedKeys"
            >
                <template #title="item">
                    <div class="treeItem" @click="() => selectDic(item.data)">
                        <div class="itemText">
                            <Ellipsis style="width: calc(100%-100px)">{{
                                item.name
                            }}</Ellipsis>
                        </div>
                        <div @click="(e) => e.stopPropagation()">
                            <ConfirmModal
                                v-if="hasPermission('system/Dictionary:action')"
                                :title="
                                    item.data.status === 1
                                        ? '确定禁用？'
                                        : '确定启用？'
                                "
                                :onConfirm="() => updateDic(item.data)"
                            >
                                <j-switch
                                    :checked="item.status"
                                    :disabled="
                                        !hasPermission(
                                            'system/Dictionary:action',
                                        )
                                    "
                                    :checkedValue="1"
                                    :unCheckedValue="0"
                                ></j-switch>
                            </ConfirmModal>
                            <j-tooltip
                                v-else
                                placement="top"
                                title="暂无权限,请联系管理员"
                            >
                                <j-switch
                                    :checked="item.status"
                                    :disabled="
                                        !hasPermission(
                                            'system/Dictionary:action',
                                        )
                                    "
                                    :checkedValue="1"
                                    :unCheckedValue="0"
                                ></j-switch>
                            </j-tooltip>
                            <PermissionButton
                                type="text"
                                hasPermission="system/Dictionary:delete"
                                :popConfirm="{
                                    title: `确定要删除？`,
                                    onConfirm: () => deleteDic(item.id),
                                }"
                            >
                                删除
                            </PermissionButton>
                            <PermissionButton
                                type="text"
                                hasPermission="system/Dictionary:update"
                                @click="showEdit(item.data)"
                            >
                                编辑
                            </PermissionButton>
                        </div>
                    </div>
                </template>
            </j-tree>
            <j-empty v-else style="margin-top: 100px" />
        </div>
    </div>
    <Save
        v-if="saveShow"
        :type="addType"
        @close-save="saveShow = false"
        @success="saveSuccess"
        :data="editData"
    />
    <Export v-if="downVisible" @closeDown="closeDown" />
    <Import />
</template>

<script lang="ts" setup>
import {
    getDicList,
    deleteDictionary,
    addDictionary,
} from '@/api/system/dictionary';
import Save from './save/index.vue';
import { onlyMessage } from '@/utils/comm';
import Export from './Export/index.vue';
import { usePermissionStore } from '@/store/permission';
const emit = defineEmits(['selectData']);
const hasPermission = usePermissionStore().hasPermission;
const saveShow = ref(false);
const addType = ref('add');
const listData = ref<any[]>([]);
const editData = ref();
const selectedKeys: any = ref([]);
const showSave = () => {
    saveShow.value = true;
    addType.value = 'add';
};
const downVisible = ref(false);
const searchValue = ref();
const queryData = (first?: Boolean, searchName?: any) => {
    const params = searchName
        ? {
              paging: false,
              sorts: [
                  { name: 'createTime', order: 'desc' },
                  { name: 'name', order: 'desc' },
              ],
              terms: [
                  {
                      terms: [
                          {
                              value: '%' + searchName + '%',
                              termType: 'like',
                              column: 'name',
                          },
                      ],
                  },
              ],
          }
        : {
              sorts: [
                  { name: 'createTime', order: 'desc' },
                  { name: 'name', order: 'desc' },
              ],
              paging: false,
          };
    getDicList(params).then((res: any) => {
        if (res.status === 200) {
            listData.value = res.result;
            if (first && res.result.length) {
                selectDic(res.result[0]);
            }
        }
    });
};
const search = () => {
    queryData(true, searchValue.value);
};
const searchChange = () => {
    if (searchValue.value === '') {
        queryData(true);
    }
};
const showEdit = (data: any) => {
    saveShow.value = true;
    addType.value = 'edit';
    editData.value = data;
};
/**
 * 重新请求数据
 */
const reload = () => {
    queryData();
};
const saveSuccess = () => {
    saveShow.value = false;
    reload();
};
/**
 *
 * @param id 字典id
 * 删除字典
 */
const deleteDic = (id: string) => {
   const response  = deleteDictionary(id)
   response.then((res: any) => {
        if (res.status === 200) {
            onlyMessage('操作成功!');
            queryData(true);
        } else {
            onlyMessage('操作失败!', 'error');
        }
    });
    return response
};
/**
 * 更新字典
 */
const updateDic = (data: any) => {
    data.status = data.status === 1 ? 0 : 1;
    const response = addDictionary(data);
    response.then((res: any) => {
        if (res.status === 200) {
            onlyMessage('操作成功!');
            reload();
        } else {
            onlyMessage('操作失败!', 'error');
        }
    });
    return response
};
/**
 * 切换选中字典
 */
const selectDic = (selectKeys: any) => {
    selectedKeys.value = [selectKeys.id];
    emit('selectData', selectKeys);
};
/**
 * 导入字典
 */
const beforeUpload = (file: any) => {
    if (file.type === 'application/json') {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async (json: any) => {
            if (json?.target?.result) {
                const text = json.target.result;
                let data;
                try {
                    data = JSON.parse(text);
                } catch {
                    onlyMessage('请上传json格式的文件', 'error');
                    return false;
                }
                const res = await addDictionary(data);
                if (res.status === 200) {
                    reload();
                    onlyMessage('操作成功！');
                }
            } else {
                onlyMessage('文件内容不能为空', 'error');
            }
        };
    } else {
        onlyMessage('请上传json格式的文件', 'error');
    }
};

const closeDown = () => {
    downVisible.value = false;
};
onMounted(() => {
    queryData(true);
});
</script>
<style lang="less" scoped>
.left-contain {
    width: 300px;
    height: 100%;
}

:deep(.ant-tree-switcher) {
    display: none;
}

.tree {
    height: calc(100% - 110px);
    overflow-y: auto;
}

.controls {
    margin: 10px 0;
}

.treeItem {
    display: flex;
    justify-content: space-between;

    .itemText {
        line-height: 32px;
        max-width: 40%;
    }
}
</style>

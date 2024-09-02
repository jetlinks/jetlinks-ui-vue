<template>
    <div class="left-contain">
        <a-input placeholder="字典名称" v-model:value="searchValue" @pressEnter="search" @change="searchChange">
            <template #suffix>
                <AIcon type="SearchOutlined" @click="search" />
            </template>
        </a-input>
        <div class="controls">
            <j-permission-button type="primary" hasPermission="system/Dictionary:add" style="width: 160px" @click="showSave" >
                新增字典
            </j-permission-button>
            <j-permission-button type="text" hasPermission="system/Dictionary:down" @click="downVisible = true">
                下载
            </j-permission-button>
            <a-upload :before-upload="beforeUpload" accept=".json" :show-upload-list="false"
                :disabled="!usePermission('system/Dictionary:import').hasPerm.value">
                <j-permission-button type="text" hasPermission="system/Dictionary:import">
                    导入
                </j-permission-button>
            </a-upload>
        </div>
        <div class="tree">
            <a-tree :tree-data="listData" v-if="listData.length" :fieldNames="{ title: 'name', key: 'id' }" blockNode
                :selectedKeys="selectedKeys">
                <template #title="item">
                    <div class="treeItem" @click="() => selectDic(item.data)">
                        <div class="itemText">
                            <j-ellipsis >{{ item.name }}</j-ellipsis>
                        </div>
                        <div @click="(e) => e.stopPropagation()">
                            <a-popconfirm
                              v-if="permission.hasPerm.value && item.data.classified !== 'system'"
                                :title="item.data.status === 1 ? '禁用后引用该字典的页面将受到影响，确认禁用？' : '确定启用？'"
                              @confirm="() => updateDic(item.data)">
                                <a-switch :checked="item.status" :disabled="!permission.hasPerm.value || item.data.classified === 'system'"
                                    :checkedValue="1" :unCheckedValue="0"></a-switch>
                            </a-popconfirm>
                            <a-tooltip
                              v-else
                              placement="top"
                              :title="!permission.hasPerm.value ? '暂无权限,请联系管理员' : '内置数据不支持修改'"
                            >
                                <a-switch :checked="item.status" :disabled="!permission.hasPerm.value || item.data.classified === 'system'"
                                    :checkedValue="1" :unCheckedValue="0"></a-switch>
                            </a-tooltip>
                            <j-permission-button
                              type="text"
                              hasPermission="system/Dictionary:delete"
                              :disabled="item.data.classified === 'system'"
                              :popConfirm="{
                                title: `确定要删除？`,
                                onConfirm: () => deleteDic(item.id),
                              }"
                              :tooltip="
                                    item.data.classified === 'system'
                                        ? { title: '内置数据不支持修改' }
                                        : null
                                "
                              style="padding: 0 10px"
                            >
                              删除
                            </j-permission-button>
                            <j-permission-button
                              type="text"
                              hasPermission="system/Dictionary:update"
                              :disabled="item.data.classified === 'system'"
                              :tooltip="
                                    item.data.classified === 'system'
                                        ? { title: '内置数据不支持修改' }
                                        : null
                                "
                              style="padding: 0 10px"
                              @click="showEdit(item.data)"
                            >
                              编辑
                            </j-permission-button>
                        </div>
                    </div>
                </template>
            </a-tree>
            <j-empty v-else style="margin-top: 100px;" />
        </div>
    </div>
    <Save v-if="saveShow" :type="addType" @close-save="saveShow = false" @success="saveSuccess" :data="editData" />
    <Export v-if="downVisible" @closeDown="closeDown" />
</template>

<script lang="ts" setup name="DictionaryLeft">
import { getDicList, deleteDictionary, addDictionary } from '@/api/system/dictionary';
import Save from './save/index.vue'
import Export from './Export/index.vue'
import { onlyMessage } from '@jetlinks-web/utils';
import { usePermission } from '@jetlinks-web/hooks'

const emit = defineEmits(['selectData'])

const saveShow = ref(false)
const addType = ref('add')
const listData = ref<any[]>([])
const editData = ref()
const selectedKeys: any = ref([])
const showSave = () => {
    saveShow.value = true
    addType.value = 'add'
}
const downVisible = ref(false)
const searchValue = ref()
const permission = usePermission('system/Dictionary:action')
const queryData = (first?: Boolean, searchName?: any) => {
    const params = searchName ? { paging:false ,sorts: [{ name: 'createTime', order: 'desc' }, { name: 'name', order: 'desc' }], terms: [{ terms: [{ value: '%' + searchName + '%', termType: 'like', column: 'name' }] }] } : { sorts: [{ name: 'createTime', order: 'desc' }, { name: 'name', order: 'desc' }], paging:false  }
    getDicList(params).then((res: any) => {
        if (res.status === 200) {
            listData.value = res.result
            if (first && res.result.length) {
                selectDic(res.result[0])
            }else if(selectedKeys.value){
              selectDic(res.result.find(i=>{
                return i.id === selectedKeys.value[0]
              }))
            }
        }
    })
}
const search = () => {
    queryData(true, searchValue.value)
}
const searchChange = () => {
    if (searchValue.value === '') {
        queryData(true)
    }
}
const showEdit = (data: any) => {
    saveShow.value = true
    addType.value = 'edit'
    editData.value = data
}
/**
 * 重新请求数据
 */
const reload = () => {
    queryData()
}
const saveSuccess = () => {
    saveShow.value = false
    reload()
}
/**
 *
 * @param id 字典id
 * 删除字典
 */
const deleteDic = (id: string) => {
    deleteDictionary(id).then((res: any) => {
        if (res.status === 200) {
            onlyMessage('操作成功!')
            queryData(true)
        } else {
            onlyMessage('操作失败!', 'error')
        }
    })
}
/**
 * 更新字典
 */
const updateDic = (data: any) => {
    data.status = data.status === 1 ? 0 : 1
    addDictionary(data).then((res: any) => {
        if (res.status === 200) {
            onlyMessage('操作成功!')
            reload()
        } else {
            onlyMessage('操作失败!', 'error')
        }
    })
}
/**
 * 切换选中字典
 */
const selectDic = (selectKeys: any) => {
    selectedKeys.value = [selectKeys.id]
    emit('selectData', selectKeys)
}
/**
 * 导入字典
 */
const beforeUpload = (file: any) => {
    if (file.type === 'application/json') {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async (json: any) => {
            if (json?.target?.result) {
                const text = json.target.result
                let data
                try {
                    data = JSON.parse(text);
                } catch {
                    onlyMessage('请上传json格式的文件', 'error')
                    return false
                }
                const res = await addDictionary(data)
                if (res.status === 200) {
                    reload()
                    onlyMessage('操作成功！')
                }
            } else {
                onlyMessage('文件内容不能为空', 'error')
            }
        };
    } else {
        onlyMessage('请上传json格式的文件', 'error')
    }
};

const closeDown = () => {
    downVisible.value = false
}
onMounted(() => {
    queryData(true)
})
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
        flex: 1 1 0;
    }
}
</style>

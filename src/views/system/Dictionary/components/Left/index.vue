<template>
    <div class="left-contain">
        <a-input :placeholder="$t('Left.index.036608-0')" v-model:value="searchValue" @pressEnter="search" @change="searchChange">
            <template #suffix>
                <AIcon type="SearchOutlined" @click="search" />
            </template>
        </a-input>
        <div class="controls">
            <j-permission-button type="primary" hasPermission="system/Dictionary:add" style="width: 120px" @click="showSave" >
                {{ $t('Left.index.036608-1') }}
            </j-permission-button>
            <j-permission-button type="text" hasPermission="system/Dictionary:down" @click="downVisible = true">
                {{ $t('Left.index.036608-2') }}
            </j-permission-button>
            <a-upload :before-upload="beforeUpload" accept=".json" :show-upload-list="false"
                :disabled="!usePermission('system/Dictionary:import').hasPerm.value">
                <j-permission-button type="text" hasPermission="system/Dictionary:import">
                    {{ $t('Left.index.036608-3') }}
                </j-permission-button>
            </a-upload>
        </div>
        <div class="tree">
            <a-tree :tree-data="listData" v-if="listData.length" :fieldNames="{ title: 'name', key: 'id' }" blockNode
                :selectedKeys="selectedKeys">
                <template #title="item">
                    <div class="treeItem" @click="() => selectDic(item.data)">
                        <div class="itemText">
                            <j-ellipsis >{{ item.i18nName }}</j-ellipsis>
                        </div>
                        <div @click="(e) => e.stopPropagation()">
                            <a-popconfirm
                              v-if="permission.hasPerm.value && item.data.classified !== 'system'"
                                :title="item.data.status === 1 ? $t('Left.index.036608-4') : $t('Left.index.036608-5')"
                              @confirm="() => updateDic(item.data)">
                                <a-switch :checked="item.status" :disabled="!permission.hasPerm.value || item.data.classified === 'system'"
                                    :checkedValue="1" :unCheckedValue="0"></a-switch>
                            </a-popconfirm>
                            <a-tooltip
                              v-else
                              placement="top"
                              :title="!permission.hasPerm.value ? $t('Left.index.036608-6') : $t('Left.index.036608-7')"
                            >
                                <a-switch :checked="item.status" :disabled="!permission.hasPerm.value || item.data.classified === 'system'"
                                    :checkedValue="1" :unCheckedValue="0"></a-switch>
                            </a-tooltip>
                            <j-permission-button
                              type="text"
                              hasPermission="system/Dictionary:delete"
                              :disabled="item.data.classified === 'system'"
                              :popConfirm="{
                                title: $t('Left.index.036608-8'),
                                onConfirm: () => deleteDic(item.id),
                              }"
                              :tooltip="
                                    item.data.classified === 'system'
                                        ? { title: $t('Left.index.036608-7') }
                                        : null
                                "
                              style="padding: 0 10px"
                            >
                              {{ $t('Left.index.036608-9') }}
                            </j-permission-button>
                            <j-permission-button
                              type="text"
                              hasPermission="system/Dictionary:update"
                              :disabled="item.data.classified === 'system'"
                              :tooltip="
                                    item.data.classified === 'system'
                                        ? { title: $t('Left.index.036608-7') }
                                        : null
                                "
                              style="padding: 0 10px"
                              @click="showEdit(item.data)"
                            >
                              {{ $t('Left.index.036608-10') }}
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
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
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
const permission = usePermission(ref('system/Dictionary:action'))
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
            onlyMessage($t('Left.index.036608-11'))
            queryData(true)
        } else {
            onlyMessage($t('Left.index.036608-12'), 'error')
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
            onlyMessage($t('Left.index.036608-11'))
            reload()
        } else {
            onlyMessage($t('Left.index.036608-12'), 'error')
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
                    onlyMessage($t('Left.index.036608-13'), 'error')
                    return false
                }
                const res = await addDictionary(data)
                if (res.status === 200) {
                    reload()
                    onlyMessage($t('Left.index.036608-14'))
                }
            } else {
                onlyMessage($t('Left.index.036608-15'), 'error')
            }
        };
    } else {
        onlyMessage($t('Left.index.036608-13'), 'error')
    }
    return false
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
        padding-right: 12px;
    }
}
</style>

<template>
  <div class="left-contain">
    <j-input placeholder="字典名称">
        <template #suffix>
            <AIcon type="SearchOutlined" />
        </template>
    </j-input>
    <div class="controls">
        <j-button type="primary" @click="showSave" style="width: 60%;">新增字典</j-button>
        <j-button type="text">下载</j-button>
        <j-button type="text">导入</j-button>
    </div>
    
    <div>
        <j-tree :tree-data="listData" :fieldNames="{title:'name',key:'id'}" blockNode>
            <template #title="item">
                <div class="treeItem">
                    <div>{{ item.name }}</div>
                    <div>
                        <j-popconfirm :title="item.data.status === 1 ? '确定禁用？' : '确定启用？'" @confirm="()=>updateDic(item.data)">
                            <j-switch v-model:checked="item.status" :checkedValue="1" :unCheckedValue="0"></j-switch>
                        </j-popconfirm>
                        <j-popconfirm title="确认删除？" @confirm="()=>deleteDic(item.id)">
                            <j-button type="text">删除</j-button>
                        </j-popconfirm>
                        <j-button type="text" @click="()=>showEdit(item.data)">编辑</j-button>
                    </div>
                </div>
            </template>
        </j-tree>
    </div>
  </div>
  <Save v-if="saveShow" :type="addType" @close-save="saveShow = false" @success="saveSuccess" :data="editData"/>
</template>

<script lang="ts" setup>
import { getDicList ,deleteDictionary,addDictionary} from '@/api/system/dictionary';
import Save from './save/index.vue'
import { onlyMessage } from '@/utils/comm';
const saveShow = ref(false)
const addType = ref('add')
const listData = ref<any[]>([])
const editData = ref()
const showSave = () =>{
    saveShow.value = true
    addType.value = 'add'
}
const queryData = () =>{
    getDicList({sorts: [{ name: 'createTime', order: 'desc' }]}).then((res:any)=>{
        if(res.status === 200){
            listData.value = res.result
        }
    })
}
const changeStatus = (value:number,item:any) =>{
    
}
const showEdit = (data:any) =>{
    saveShow.value = true
    addType.value = 'edit'
    editData.value = data
}
/**
 * 重新请求数据
 */
const reload = () =>{
    queryData()
}
const saveSuccess = () =>{
    saveShow.value = false
    reload()
}
/**
 * 
 * @param id 字典id
 * 删除字典
 */
const deleteDic = (id:string) =>{
    deleteDictionary(id).then((res:any)=>{
        if(res.status === 200){
            onlyMessage('操作成功!')
            reload()
        }else{
            onlyMessage('操作失败!','error')
        }
    })
}
/**
 * 更新字典
 */
const updateDic = (data:any)=>{
    data.status = data.status === 1 ? 0 : 1
    addDictionary(data).then((res:any)=>{
        if(res.status===200){
            onlyMessage('操作成功!')
            reload()
        }else{
            onlyMessage('操作失败!','error')
        }
    })
}
onMounted(()=>{
    queryData()
})
</script>
<style lang="less" scoped>
:deep(.ant-tree-switcher){
    display: none;
}
.controls{
    margin: 10px 0;
}
.treeItem{
    display: flex;
    justify-content: space-between;
}
</style>
<template>
  <div class="left-contain">
    <j-input placeholder="字典名称">
        <template #suffix>
            <AIcon type="SearchOutlined" />
        </template>
    </j-input>
    <div class="controls">
        <PermissionButton
            type="primary"
            :hasPermission="true"
            @click="showSave"
            style="width: 60%"
        >
            新增字典
        </PermissionButton>
        <!-- <j-button type="primary" @click="showSave" style="width: 60%;">新增字典</j-button> -->
        <PermissionButton
            type="text"
            :hasPermission="true"
            @click="downVisible=true"
        >
            下载
        </PermissionButton>
        <!-- <j-button type="text" @click="downVisible=true">下载</j-button> -->
        <j-upload
            :before-upload="beforeUpload"
            accept=".json"
            :show-upload-list="false"
        >
            <j-button type="text">导入</j-button>
        </j-upload>
    </div>
    
    <div>
        <j-tree :tree-data="listData" :fieldNames="{title:'name',key:'id'}" blockNode  :selectedKeys="selectedKeys">
            <template #title="item">
                <div class="treeItem" @click="()=>selectDic(item.data)">
                    <div class="itemText"><Ellipsis style="width: calc(100%-100px)">{{ item.name }}</Ellipsis></div>
                    <div @click="(e) => e.stopPropagation()">
                        <j-popconfirm :title="item.data.status === 1 ? '确定禁用？' : '确定启用？'" @confirm="()=>updateDic(item.data)">
                            <j-switch v-model:checked="item.status" :checkedValue="1" :unCheckedValue="0"></j-switch>
                        </j-popconfirm>
                        <PermissionButton
                              type="text"
                              :hasPermission="true"
                              :popConfirm="{
                                  title: `确定要删除？`,
                                  onConfirm: () => deleteDic(item.id),
                              }"
                          >
                          删除
                          </PermissionButton>
                        <!-- <j-popconfirm title="确认删除？" @confirm="()=>deleteDic(item.id)">
                            <j-button type="text">删除</j-button>
                        </j-popconfirm> -->
                        <PermissionButton
                            type="text"
                            :hasPermission="true"
                            @click="showEdit(item.data)"
                          >
                          编辑
                          </PermissionButton>
                        <!-- <j-button type="text" @click="()=>showEdit(item.data)">编辑</j-button> -->
                    </div>
                </div>
            </template>
        </j-tree>
    </div>
  </div>
  <Save v-if="saveShow" :type="addType" @close-save="saveShow = false" @success="saveSuccess" :data="editData"/>
  <Export v-if="downVisible" @closeDown="closeDown"/>
  <Import/>
</template>

<script lang="ts" setup>
import { getDicList ,deleteDictionary,addDictionary} from '@/api/system/dictionary';
import Save from './save/index.vue'
import { onlyMessage} from '@/utils/comm';
import Export from './Export/index.vue'
const emit = defineEmits(['selectData'])
const saveShow = ref(false)
const addType = ref('add')
const listData = ref<any[]>([])
const editData = ref()
const selectedKeys:any = ref([])
const showSave = () =>{
    saveShow.value = true
    addType.value = 'add'
}
const downVisible = ref(false)
const queryData = (first?:Boolean) =>{
    getDicList({sorts: [{ name: 'createTime', order: 'desc' }]}).then((res:any)=>{
        if(res.status === 200){
            listData.value = res.result
            if(first){
                selectDic(res.result[0])
            }
        }
    })
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
            queryData(true)
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
/**
 * 切换选中字典
 */
const selectDic = (selectKeys:any)=>{
    selectedKeys.value = [selectKeys.id]
    emit('selectData',selectKeys)
}
/**
 * 导入字典
 */
 const beforeUpload = (file:any) => {
    if(file.type === 'application/json') {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async(json) => {
            if(json.target?.result){
                const data = JSON.parse(json.target?.result);
                const res =await addDictionary(data)
                if(res.status === 200){
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

const closeDown = () =>{
    downVisible.value = false
}
onMounted(()=>{
    queryData(true)
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
    .itemText{
        line-height: 32px;
        max-width:40%
    }
}
</style>
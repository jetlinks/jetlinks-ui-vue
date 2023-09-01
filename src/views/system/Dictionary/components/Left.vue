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
        <j-list :dataSource="listData">
            <template #renderItem="{ item }">
                <j-list-item>
                    {{ item.name }}
                    <template #actions>
                        <j-switch :checked="item.status"></j-switch>
                        <j-button type='text'>删除</j-button>
                        <j-button type="text">编辑</j-button>
                    </template>
                </j-list-item>
            </template>
        </j-list>
    </div>
  </div>
  <Save v-if="saveShow" :type="addType" @close-save="saveShow = false" @success="saveSuccess"/>
</template>

<script lang="ts" setup>
import { getDicList } from '@/api/system/dictionary';
import Save from './save/index.vue'
const saveShow = ref(false)
const addType = ref('add')
const listData = ref<any[]>([])
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
const saveSuccess = () =>{
    queryData()
}
onMounted(()=>{
    queryData()
})
</script>
<style lang="less" scoped>
.controls{
    margin: 10px 0;
}
</style>
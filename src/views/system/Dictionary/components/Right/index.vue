<template>
  <div>
    <div class="des_head">
        <div>字典ID：<span>{{ data.id }}</span></div>
        <div>说明：<span>{{ data.describe }}</span></div>
        <div>创建日期：<span>{{ data.name }}</span></div>
    </div>
    <div class="contain">
        <pro-search
            :columns="columns"
            @search="handleSearch"
        />
        <JProTable :columns="columns" 
                    model="TABLE" 
                    :request="queryItem"
                    :params="params"
                    ref="tableRef"
        >
            <template #headerTitle>
                    <PermissionButton
                        type="primary"
                        @click="add"
                    >
                        新增
                    </PermissionButton>
            </template>
        </JProTable>
    </div>
  </div>
  <Save v-if="saveVisible" :dicId='data.id' :sort=sort @closeModal="closeModal" @refresh="refresh"/>
</template>

<script lang="ts" setup>
import { queryDicItem } from '@/api/system/dictionary'
import Save from './Save/index.vue'
const props = defineProps({
    data:{
        type:Object,
        default:{}
    }
})
const params = ref()
const tableRef = ref()
const saveVisible = ref(false)
const sort = ref(0)
const columns = [
    {
        title:'序号',
        dataIndex:'ordinal',
        key:'ordinal',
        search:{
            type:'number'
        }
    },
    {
        title: 'name',
        dataIndex: 'name',
        key: 'name', 
        ellipsis: true,
        search:{
            type:'string'
        }
    },
    {
        title: 'value',
        dataIndex: 'value',
        key: 'value',
        ellipsis: true,
        search:{
            type:'string'
        }
    },
    {
        title: 'text',
        dataIndex: 'text',
        key: 'text',
        ellipsis: true,
        search:{
            type:'string'
        }
    },{
        title:'操作',
        dataIndex:'action',
        key:'action',
        scopedSlots: true,
    }
];

const add = () =>{
    saveVisible.value = true
}

const closeModal = () =>{
    saveVisible.value = false
}
const handleSearch = (i:any)=>{
    params.value = i
}
const refresh = () =>{
    saveVisible.value = false
    tableRef.value.reload()
}
const queryItem =async(_params:any)=>{
    if (props.data?.id) {
            const params = {
                ..._params,
                sorts: [{ name: 'createTime', order: 'desc' }],
                terms: [
                    ..._params.terms,
                    {
                        column: 'dictId',
                        termType: 'eq',
                        value: props.data?.id
                    },
                ],
            };
            const resp: any = await queryDicItem(params);
            sort.value = resp?.result?.total + 1
            if(resp.status===200){
                return {
                code: resp.status,
                result: resp.result,
                status: resp.status,
                };
            }
        } else {
            sort.value= 1
            return {
                code: 200,
                result: {
                    data: [],
                    pageIndex: 0,
                    pageSize: 0,
                    total: 0,
                },
                status: 200,
            };
        }
    }
</script>
<style lang="less" scoped>
.des_head{
    padding: 10px 20px;
    background-color: rgb(242, 242, 242);
    span{
        color:rgb(127, 127, 127)
    }
}
</style>
<!-- webhook请求头可编辑表格 -->
<template>
    <div class="table-wrapper">
        <j-form :model="dataSource.table" ref="tableRef">
            <j-table :columns="columns" :data-source="dataSource.table" bordered :pagination="false" rowKey="_key">
                <template #bodyCell="{ column, text, record, index }">
                    <template v-if="['key', 'value'].includes(column.dataIndex)">
                        <j-form-item :name="[index, column.dataIndex]"  :rules="[
                            {
                            max: 64,
                            message: '最多可输入64个字符'
                            }, 
                            { required: true, message: `请输入${column.title}`, trigger: 'blur' }]"
                            >
                            <j-input v-model:value="record[column.dataIndex]"/></j-form-item>
                    </template>
                    <template v-else-if="column.dataIndex === 'operation'">
                        <j-button type="text">
                            <template #icon>
                                <delete-outlined @click="handleDelete(record.id)" />
                            </template>
                        </j-button>
                    </template>
                </template>
            </j-table>
            <j-button type="dashed" @click="handleAdd" style="width: 100%; margin-top: 5px">
                <template #icon>
                    <plus-outlined />
                </template>
                添加
            </j-button>
        </j-form>
    </div>
</template>

<script setup lang="ts">
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { PropType } from 'vue';
import type { IHeaders } from '../../types';
import { randomString } from '@/utils/utils'
import { reject } from 'lodash-es';
type Emits = {
    (e: 'update:headers', data: IHeaders[]): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    headers: {
        type: Array as PropType<IHeaders[]>,
        default: () => [],
    },
});


const data = ref();
const tableRef = ref();

const columns = [
    {
        title: 'KEY',
        dataIndex: 'key',
    },
    {
        title: 'VALUE',
        dataIndex: 'value',
    },
    {
        title: '操作',
        dataIndex: 'operation',
        width: 80,
        fixed: 'right',
    },
];
const handleHeader= (data:any) =>{
    return data.map((item:any)=>{
        return {...item,_key: randomString()}
    })
}
const dataSource = reactive({
    table:props.headers.length > 0 ? handleHeader(props.headers) : []
});

watch(()=>JSON.stringify(props.headers),()=>{
    dataSource.table = handleHeader(props.headers)
})
const handleDelete = (id: number) => {
    const idx = dataSource.table.findIndex((f) => f.id === id);
    dataSource.table.splice(idx, 1);
};
const valueChange = () =>{
    data.value  =  dataSource.table.map((item:any)=>{
        const {_key,...extra}=item;
        return extra
    })
}
const handleAdd = () => {
    dataSource.table.push({
        _key: randomString(),
        key: '',
        value: '',
    });
};
const validate = () =>{
   return new Promise((resolve:any,reject:any)=>{
    if(dataSource.table){
        tableRef.value.validate().then(()=>{
        valueChange()
        resolve(data.value)
    }).catch((err:any)=>{
        console.log(err);
        reject(false)
    })
    }else{
        resolve([])
    }
   })
}
defineExpose({
    validate,
})
</script>

<style lang="less" scoped>
:deep(.ant-form-item){
    margin-top: -20px ;
}
</style>

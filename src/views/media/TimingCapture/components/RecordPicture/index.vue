<template>
    <a-modal visible  :footer="null" :width="800"  @cancel="emit('close')" :maskClosable="false">
        <div class="datePicker">
            <span>选择日期：</span>
            <a-range-picker v-model:value="rangeDate" valueFormat="YYYY-MM-DD HH:mm:ss"/>
        </div>
        <div v-if="pictures.length">
            <div class="thumbnailContainer">
            <div  v-for="item in pictures" class="thumbnail">
                <img  :src="item.others?.thumbnailPath" alt="" @click="showPreview(item)">
            </div>
            
        </div>
        <div class="custom-pagination">
            <a-pagination
                :showQuickJumper="false"
                :showSizeChanger="true"
                :total="total"
                :current="pageIndex + 1"
                :pageSize="pageSize"
                :pageSizeOptions="['20', '40',  '60', '100']"
                :showTotal="
                    (num) => {
                        const minSize = pageIndex * pageSize + 1;
                        const MaxSize = (pageIndex + 1) * pageSize;
                        return `第 ${minSize} - ${
                            MaxSize > num ? num : MaxSize
                        } 条/总共 ${total} 条`;
                    }
                "
                @change="onChange"
            ></a-pagination>
        </div>
        </div>
        <a-empty v-else/>
    </a-modal>
    <Preview v-if="visiblePreview" @closePreview="visiblePreview = false" :record="record" :channel="data"></Preview>
</template>
<script setup>
import Preview from './Preview.vue'
import { queryFiles } from '@/api/media/auto';


const emit = defineEmits(['close']);
const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
})


const total = ref(0);
const pageIndex = ref(0);
const pageSize = ref(20);
const rangeDate = ref()
const pictures = ref([])
const visiblePreview = ref(false)
const record = ref()


const getImg =async (terms)=>{
    const item = {
        pageIndex:pageIndex.value,
        pageSize:pageSize.value,
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms:[
            {column:'channelId',value:props.data.channelId,termType:'eq',type:'and'},
            {column:'fileType',value:'screenshot',termType:'eq',type:'and'}
        ]
    }
    if(terms){
        item.terms.push(terms)
    }

    const res = await queryFiles(item)
    if(res.success){
        pictures.value = res.result.data
        pageIndex.value = res.result.pageIndex
        pageSize.value = res.result.pageSize
        total.value = res.result.total
    }
}

const onChange = (page,size)=>{
    console.log('page====',page,size);
    pageIndex.value = page - 1
    pageSize.value = size
}

onMounted(()=>{
    getImg()
})

watch(()=>[pageIndex.value,pageSize.value],()=>{
    getImg()
})

watch(
    ()=>rangeDate.value,
    (val)=>{
        console.log('val====',val);
        if(val){
            getImg({
                column:'createTime',
                termType:'btw',
                value:val
            }) 
        }else{
            getImg()
        }
    }
)

const showPreview = (item) =>{
    visiblePreview.value = true
    record.value = item
}
</script>
<style lang="less" scoped>
.datePicker{
    margin-bottom: 12px;
}
.thumbnailContainer{
    display: flex;
    flex-wrap: wrap;
    
    .thumbnail{
        width: 20%;
        padding: 6px;
        img{
            width: 100%;
            height: 100%;
        }
    }
}
.custom-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    :deep(.ant-pagination-item) {
        display: none !important;
    }
    :deep( .ant-pagination-jump-next){
        display: none !important;
    }
}
</style>

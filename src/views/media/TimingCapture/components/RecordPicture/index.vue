<template>
    <a-modal visible :closable="false" :footer="null" :width="800">
        <div class="datePicker">
            <span>选择日期：</span>
            <a-range-picker v-model:value="rangeDate" />
        </div>
        <div class="thumbnailContainer">
            <img v-for="i in pictures" class="thumbnail" src="" alt="" @click="showPreview">
        </div>
        <div class="custom-pagination">
            <a-pagination
                :showQuickJumper="false"
                :showSizeChanger="true"
                :total="total"
                :current="pageIndex + 1"
                :pageSize="pageSize"
                :pageSizeOptions="['12', '24', '48', '60', '100']"
                :showTotal="
                    (num) => {
                        const minSize = pageIndex * pageSize + 1;
                        const MaxSize = (pageIndex + 1) * pageSize;
                        return `第 ${minSize} - ${
                            MaxSize > num ? num : MaxSize
                        } 条/总共 ${num} 条`;
                    }
                "
                onChange=""
            ></a-pagination>
        </div>
    </a-modal>
    <Preview v-if="visiblePreview" @closePreview="visiblePreview = false"></Preview>
</template>
<script setup>
import Preview from './Preview.vue'
const total = ref(0);
const pageIndex = ref(0);
const pageSize = ref(12);
const rangeDate = ref()
const pictures = ref()
const visiblePreview = ref(true)

const showPreview = () =>{
    visiblePreview.value = true
}
</script>
<style lang="less" scoped>
.thumbnailContainer{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .thumbnail{
        width: 19%;
    }
}
.custom-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    :deep(.ant-pagination-item) {
        display: none !important;
    }
}
</style>

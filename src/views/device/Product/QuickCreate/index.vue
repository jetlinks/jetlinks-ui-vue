<template>
    <page-container>
        <div class="container">
            <div class="header">
                <a-row align="middle">
                    <a-col :span="18">请选择资源</a-col>
                    <a-col :span="6"> <a-input placeholder="请输入关键字" v-model:value="searchParams"></a-input></a-col>
                </a-row>
            </div>


        </div>
        <div class="content">
            <div class="left_search">
                <a-tabs v-model:activeKey="activeKey" @change="typeChange">
                    <a-tab-pane v-for="i in classificationType" :key="i.id" :tab="i.name">
                        <SearchTree :data="classification"/>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>
    </page-container>
</template>

<script setup>
import SearchTree from './components/SearchTree.vue';
import { queryClassificationType, queryClassification } from '@/api/device/quickCreate.ts'
const searchParams = ref('')
const activeKey = ref(undefined)
//分类类型
const classificationType = ref([])
//分类数据
const classification = ref([])
const getClassificationType = async () => {
    const res = await queryClassificationType();
    if (res.success) {
        classificationType.value = res.result;
        activeKey.value = res.result?.[0]?.id
    }
}

const getClassification = async (classificationTypeId) => {
    const parmas = {
        terms: [{
            "column": "classificationTypeId",
            "termType": "eq",
            "value": classificationTypeId
        }]
    }
    const res = await queryClassification(parmas);
    if(res.success){
        classification.value = res.result
    }
}

const typeChange = async (key) => {
    getClassification(key)
}

onMounted(() => {
    getClassificationType()
})
</script>
<style lang='less' scoped>
.header {
    background-color: #fff;
    padding: 5px 10px;
    color: #7f7f7f
}
</style>
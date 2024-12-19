<template>
    <page-container>
        <FullPage>
            <template v-if="!selectedResource">
                <div class="container">
                    <div class="header">
                        <a-row align="middle">
                            <a-col :span="18">请选择资源</a-col>
                            <a-col :span="6"> <a-input placeholder="请输入关键字"
                                    v-model:value="searchParams"></a-input></a-col>
                        </a-row>
                    </div>
                </div>
                <div class="content">
                    <div class="left_search">
                        <a-tabs v-model:activeKey="activeKey" @change="typeChange">
                            <a-tab-pane v-for="i in classificationType" :key="i.id" :tab="i.name">
                                <SearchTree :data="classification" @select="select" />
                            </a-tab-pane>
                        </a-tabs>
                    </div>
                    <div class="right_list">
                        <a-row :gutter="[16, 16]">
                            <a-col :span="8" v-for="i in resourceData" :key="i.id">
                                <div class="resource" @click="() => chooseResource(i)">
                                    <img :src="i.photoUrl?.url" alt="" class="resourceImg">
                                    <div>
                                        <div>
                                            {{ i.name }}
                                        </div>
                                        <div style="color:#8e8e8e">
                                            {{ i.describe }}
                                        </div>
                                    </div>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                </div>
            </template>
            <Operation v-else @reselection="reselection"></Operation>
        </FullPage>
    </page-container>
</template>

<script setup>
import SearchTree from './components/SearchTree.vue';
import { queryClassificationType, queryClassification } from '@/api/device/quickCreate.ts'
import Operation from './Operation.vue';
const searchParams = ref('')
const activeKey = ref(undefined)
//分类类型
const classificationType = ref([
    {
        "id": "1866398366079029248",
        "name": "品牌",
        "creatorId": "1199596756811550720",
        "createTime": 1733819021132
    },
    {
        "id": "1866398366091612160",
        "name": "行业",
        "creatorId": "1199596756811550720",
        "createTime": 1733819021132
    },
    {
        "id": "1866398366091612161",
        "name": "品类",
        "creatorId": "1199596756811550720",
        "createTime": 1733819021132
    }
])
//分类数据
const classification = ref([
    {
        "id": "5e41c296-6abd-423b-8781-22a1c62ceec3",
        "path": "SBur",
        "sortIndex": 1,
        "level": 1,
        "name": "建筑",
        "classificationTypeId": "1866398366091612160",
        "creatorId": "1199596756811550720",
        "createTime": 1733819161446,
        "children": [
            {
                "id": "9cf1900f-e573-4f0d-aaab-6d18f59c6a34",
                "parentId": "5e41c296-6abd-423b-8781-22a1c62ceec3",
                "path": "SBur-Oux9",
                "sortIndex": 1,
                "level": 2,
                "name": "桥梁建设",
                "classificationTypeId": "1866398366091612160",
                "creatorId": "1199596756811550720",
                "createTime": 1733819189718
            },
            {
                "id": "af881773-71a9-46b2-8ee0-718a5151bfe5",
                "parentId": "5e41c296-6abd-423b-8781-22a1c62ceec3",
                "path": "SBur-CPE8",
                "sortIndex": 1,
                "level": 2,
                "name": "桥梁建设A",
                "classificationTypeId": "1866398366091612160",
                "creatorId": "1199596756811550720",
                "createTime": 1733822120806
            }
        ]
    }
])
const selectedClassification = ref()
const selectedResource = ref(undefined)
const resourceData = ref([
    {
        "id": "1867497108245327872",
        "type": {
            "text": "数采",
            "value": "collector"
        },
        "photoUrl": {
            "type": {
                "text": "本地上传",
                "value": "internal"
            },
            "url": "http://192.168.35.114:9000/api/file/O5O1FkHvM0KSfocXIikH5swcFLaHkHJV.png?accessKey=eb8974eed7ff40f1374a3fd6fb0a7199"
        },
        "name": "MQTT设备模板",
        "describe": "备注：测试",
        "charge": false
    },
    {
        "id": "1867497104864718848",
        "type": {
            "text": "数采",
            "value": "collector"
        },
        "photoUrl": {
            "type": {
                "text": "本地上传",
                "value": "internal"
            },
            "url": "http://192.168.35.114:9000/api/file/O5O1FkHvM0KSfocXIikH5swcFLaHkHJV.png?accessKey=eb8974eed7ff40f1374a3fd6fb0a7199"
        },
        "name": "MQTT设备模板",
        "describe": "备注：测试",
        "charge": false
    },
    {
        "id": "1867497104864718848",
        "type": {
            "text": "数采",
            "value": "collector"
        },
        "photoUrl": {
            "type": {
                "text": "本地上传",
                "value": "internal"
            },
            "url": "http://192.168.35.114:9000/api/file/O5O1FkHvM0KSfocXIikH5swcFLaHkHJV.png?accessKey=eb8974eed7ff40f1374a3fd6fb0a7199"
        },
        "name": "MQTT设备模板",
        "describe": "备注：测试",
        "charge": false
    },
    {
        "id": "1867497104864718848",
        "type": {
            "text": "数采",
            "value": "collector"
        },
        "photoUrl": {
            "type": {
                "text": "本地上传",
                "value": "internal"
            },
            "url": "http://192.168.35.114:9000/api/file/O5O1FkHvM0KSfocXIikH5swcFLaHkHJV.png?accessKey=eb8974eed7ff40f1374a3fd6fb0a7199"
        },
        "name": "MQTT设备模板",
        "describe": "备注：测试",
        "charge": false
    }
])
const getClassificationType = async () => {
    const res = await queryClassificationType();
    if (res.success) {
        classificationType.value = res.result;
        activeKey.value = res.result?.[0]?.id
    }
}

const getClassification = async (classificationTypeId) => {
    const params = {
        terms: [{
            "column": "classificationTypeId",
            "termType": "eq",
            "value": classificationTypeId
        }]
    }
    const res = await queryClassification(params);
    if (res.success) {
        classification.value = res.result
    }
}

const typeChange = async (key) => {
    getClassification(key)
}

const select = (key) => {
    selectedClassification.value = key
}

const chooseResource = (data) => {
    selectedResource.value = data;
}

const reselection = () =>{
    selectedResource.value = undefined
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

.content {
    display: flex;
    height: calc(100% - 40px);

    .left_search {
        flex: 1;
        padding: 0 10px;
        border-right: 1px solid #cdcdcd;
    }

    .right_list {
        flex: 3;
        padding: 20px;
    }
}

.resource {
    cursor: pointer;
    border: 1px solid #cdcecf;
    display: flex;
    padding: 10px;
    border-radius: 5px;
    align-self: center;

    .resourceImg {
        height: 40px;
        width: 40px;
        margin-right: 8px;
    }
}
</style>
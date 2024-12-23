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
                        <a-row :gutter="[16, 16]" v-if="resourceData.length">
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
                        <a-empty v-else></a-empty>
                    </div>
                </div>
            </template>
            <Operation v-else :data="selectedResource" @reselection="reselection"></Operation>
        </FullPage>
    </page-container>
</template>

<script setup>
import SearchTree from './components/SearchTree.vue';
import { queryClassificationType, queryClassification } from '@/api/device/quickCreate.ts'
import { queryTemplate } from '@/api/device/product.ts'
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
                "id": "1866776402031923200",
                "type": {
                    "text": "设备模板",
                    "value": "device"
                },
                "photoUrl": {
                    "type": {
                        "text": "本地上传",
                        "value": "internal"
                    },
                    "url": "http://192.168.35.114:9000/api/file/O5O1FkHvM0KSfocXIikH5swcFLaHkHJV.png?accessKey=eb8974eed7ff40f1374a3fd6fb0a7199",
                    "name": "test.png"
                },
                "name": "MQTT设备模板",
                "describe": "备注：测试",
                "source": [
                    "使用MQTT标准协议接入的设备",
                    "使用MQTT标准协议接入的网关设备"
                ],
                "repositoryUrl": "https://github.com/jetlinks-v2",
                "docUrl": [
                    {
                        "type": {
                            "text": "外链地址",
                            "value": "external"
                        },
                        "url": "https://hanta.yuque.com/px7kg1/dev",
                        "name": "语雀文档"
                    },
                    {
                        "type": {
                            "text": "本地上传",
                            "value": "internal"
                        },
                        "url": "http://192.168.35.114:9000/api/file/O5O1FkHvM0KSfocXIikH5swcFLaHkHJV.png?accessKey=eb8974eed7ff40f1374a3fd6fb0a7199",
                        "name": "test.png"
                    }
                ],
                "coverUrl": {
                    "type": {
                        "text": "本地上传",
                        "value": "internal"
                    },
                    "url": "http://192.168.35.114:9000/api/file/O5O1FkHvM0KSfocXIikH5swcFLaHkHJV.png?accessKey=eb8974eed7ff40f1374a3fd6fb0a7199",
                    "name": "cover.png"
                },
                "videoUrl": {
                    "type": {
                        "text": "本地上传",
                        "value": "internal"
                    },
                    "url": "http://192.168.35.114:9000/api/file/O5O1FkHvM0KSfocXIikH5swcFLaHkHJV.png?accessKey=eb8974eed7ff40f1374a3fd6fb0a7199",
                    "name": "video"
                },
                "loopPicUrl": [
                    {
                        "type": {
                            "text": "本地上传",
                            "value": "internal"
                        },
                        "url": "http://192.168.35.114:9000/api/file/O5O1FkHvM0KSfocXIikH5swcFLaHkHJV.png?accessKey=eb8974eed7ff40f1374a3fd6fb0a7199",
                        "name": "test.png"
                    },
                    {
                        "type": {
                            "text": "本地上传",
                            "value": "internal"
                        },
                        "url": "http://192.168.35.114:9000/api/file/O5O1FkHvM0KSfocXIikH5swcFLaHkHJV.png?accessKey=eb8974eed7ff40f1374a3fd6fb0a7199",
                        "name": "test.png"
                    }
                ],
                "developDuration": 5.5,
                "charge": false,
                "classification": [
                    {
                        "id": "1866398366079029248",
                        "name": "品牌",
                        "children": [
                            {
                                "id": "8ef03e87-a45e-434d-86ee-b5f7881072df",
                                "classificationId": "1866398366079029248",
                                "name": "海康威视",
                                "order": 1
                            }
                        ]
                    },
                    {
                        "id": "1866398366091612161",
                        "name": "品类",
                        "children": [
                            {
                                "id": "089a5110-d24d-4e29-94a0-6283e66ea31b",
                                "classificationId": "1866398366091612161",
                                "name": "传感器",
                                "order": 1
                            }
                        ]
                    },
                    {
                        "id": "1866398366091612160",
                        "name": "行业",
                        "children": [
                            {
                                "id": "d03469b8-c492-40d6-943f-8651d88d1a07",
                                "classificationId": "1866398366091612160",
                                "name": "智能安防",
                                "order": 1
                            },
                            {
                                "id": "40701834-0223-4b75-ad10-9acfa2e92625",
                                "classificationId": "1866398366091612160",
                                "name": "h1",
                                "order": 1
                            }
                        ]
                    }
                ],
                "model": [
                    {
                        "id": "1384042230ee740a630e18fee22a9e73",
                        "name": "test4",
                        "children": [
                            {
                                "id": "1868859775522103296",
                                "classificationId": "1384042230ee740a630e18fee22a9e73",
                                "name": "呵呵呵呵呵额呵53333",
                                "order": 1
                            },
                            {
                                "id": "1868859739006492672",
                                "classificationId": "1384042230ee740a630e18fee22a9e73",
                                "name": "呵呵呵呵呵额呵5555",
                                "order": 2
                            }
                        ]
                    }
                ],
                "state": {
                    "text": "正常",
                    "value": "enabled"
                },
                "deviceType": [
                    {
                        "text": "直连设备",
                        "value": "device"
                    },
                    {
                        "text": "网关设备",
                        "value": "gateway"
                    }
                ],
                "accessInfos": [
                    {
                        "provider": "mqtt-server-gateway",
                        "channel": "network",
                        "bindInfo": [
                            {
                                "id": "1868550086119489536",
                                "type": "protocol",
                                "name": "官方协议包",
                                "defaultAccess": true
                            }
                        ],
                        "transport": "mqtt",
                        "configuration": {},
                        "defaultAccess": true
                    }
                ],
                "metadata": "{\"functions\":[],\"properties\":[{\"valueType\":{\"falseValue\":\"false\",\"trueText\":\"是\",\"trueValue\":\"true\",\"falseText\":\"否\",\"type\":\"boolean\"},\"name\":\"boolean类型属性示例\",\"description\":\"boolean类型属性示例的说明\",\"id\":\"boolean_id\"},{\"valueType\":{\"tz\":\"Asia/Shanghai\",\"format\":\"timestamp\",\"type\":\"date\"},\"name\":\"date类型属性示例\",\"description\":\"date类型属性示例的说明\",\"id\":\"date_id\"},{\"valueType\":{\"unit\":\"pascal\",\"round\":\"HALF_UP\",\"scale\":8,\"type\":\"double\"},\"name\":\"double类型属性示例\",\"description\":\"double类型属性示例的说明。数据类型配置可以为空\",\"id\":\"double_id\"},{\"valueType\":{\"elements\":[{\"description\":\"枚举说明0\",\"text\":\"0\",\"value\":\"枚举值0\"},{\"description\":\"枚举说明1\",\"text\":\"1\",\"value\":\"枚举值1\"},{\"description\":\"枚举说明2\",\"text\":\"2\",\"value\":\"枚举值2\"}],\"type\":\"enum\"},\"name\":\"enum类型属性示例\",\"description\":\"enum类型属性示例的说明\",\"id\":\"enum_id\"},{\"valueType\":{\"unit\":\"megahertz\",\"round\":\"HALF_UP\",\"scale\":6,\"type\":\"float\"},\"name\":\"float类型属性示例\",\"description\":\"float类型属性示例的说明。数据类型配置可以为空\",\"id\":\"float_id\"},{\"valueType\":{\"unit\":\"ohm\",\"round\":\"HALF_UP\",\"type\":\"int\"},\"name\":\"int类型属性示例\",\"description\":\"int类型属性示例的说明。数据类型配置可以为空\",\"id\":\"int_id\"},{\"valueType\":{\"unit\":\"cubicKilometer\",\"round\":\"HALF_UP\",\"type\":\"long\"},\"name\":\"long类型属性示例\",\"description\":\"long类型属性示例的说明。数据类型配置可以为空\",\"id\":\"long_id\"},{\"valueType\":{\"expands\":{\"maxLength\":630},\"type\":\"string\"},\"name\":\"string类型属性示例\",\"description\":\"string类型属性示例的说明\",\"id\":\"string_id\"},{\"valueType\":{\"lonProperty\":\"lon\",\"type\":\"geoPoint\",\"latProperty\":\"lat\"},\"name\":\"geoPoint类型属性示例\",\"description\":\"geoPoint类型属性示例的说明\",\"id\":\"geoPoint_id\"},{\"valueType\":{\"bodyType\":\"url\",\"mediaType\":\"*/*\",\"type\":\"file\"},\"name\":\"file类型属性示例\",\"description\":\"file类型属性示例的说明\",\"id\":\"file_id\"},{\"valueType\":{\"expands\":{\"maxLength\":7},\"type\":\"password\"},\"name\":\"password类型属性示例\",\"description\":\"password类型属性示例的说明\",\"id\":\"password_id\"}],\"events\":[],\"tags\":[]}"
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

const reselection = () => {
    selectedResource.value = undefined
}

const getTemplateList = async () => {
    const params = {
        "pageIndex": 0,
        "pageSize": 12,
        "sorts": [
            {
                "name": "createTime",
                "order": "desc"
            }
        ],
        "terms": [
            {
                "column": "type",
                "value": "device"
            }
        ]
    }
    const res = await queryTemplate(params);
    if (res.success) {
        // resourceData.value = res.result?.data || []
    }
}

onMounted(() => {
    getClassificationType()
    getTemplateList()
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
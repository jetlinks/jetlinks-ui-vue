<template>
    <page-container>
        <FullPage>
            <template v-if="!selectedResource">
                <div class="container">
                    <div class="header">
                        <a-row align="middle">
                            <a-col :span="18">请选择资源</a-col>
                            <a-col :span="6">
                                <a-input
                                    placeholder="请输入关键字"
                                    v-model:value="searchParams"
                                    ><template #suffix>
                                        <AIcon type="SearchOutlined" />
                                    </template> </a-input
                            ></a-col>
                        </a-row>
                    </div>
                </div>
                <div class="content">
                    <div class="left_search">
                        <a-tabs
                            v-model:activeKey="activeKey"
                            @change="typeChange"
                        >
                            <a-tab-pane
                                v-for="i in classificationType"
                                :key="i.id"
                                :tab="i.name"
                            >
                                <SearchTree
                                    :data="classification"
                                    @select="select"
                                />
                            </a-tab-pane>
                        </a-tabs>
                    </div>
                    <div class="right_list">
                        <a-row :gutter="[16, 16]" v-if="resourceData.length">
                            <a-col
                                :span="8"
                                v-for="i in resourceData"
                                :key="i.id"
                            >
                                <div
                                    class="resource"
                                    @click="() => chooseResource(i)"
                                >
                                    <img
                                        :src="i.photoUrl?.url || imageMap.get(i.type?.value)"
                                        alt=""
                                        class="resourceImg"
                                    />
                                    <div style="margin-left: 10px;">
                                        <div>
                                            <j-ellipsis>
                                                {{ i.name }}
                                            </j-ellipsis>
                                        </div>
                                        <div style="color: #8e8e8e;margin-top: 20px;">
                                            <j-ellipsis>
                                                {{ i.describe || '--'}}
                                            </j-ellipsis>
                                        </div>
                                    </div>
                                </div>
                            </a-col>
                        </a-row>
                        <a-empty v-else></a-empty>
                    </div>
                </div>
            </template>
            <Operation
                v-else
                :data="selectedResource"
                @reselection="reselection"
            ></Operation>
        </FullPage>
    </page-container>
</template>

<script setup>
import SearchTree from './components/SearchTree.vue';
import {
    queryClassificationType,
    queryClassification,
} from '@/api/device/quickCreate.ts';
import { queryTemplate, queryTemplateDetail } from '@/api/device/product.ts';
import Operation from './Operation.vue';
import { resource } from '@/assets';
const imageMap = new Map([
    ['device', resource.deviceDefaultImage],
    ['collector', resource.collectorDefaultImage],
    ['protocol', resource.protocolDefaultImage],
]);

const searchParams = ref('');
const activeKey = ref(undefined);
//分类类型
const classificationType = ref([]);
//分类数据
const classification = ref([]);
const selectedClassification = ref();
const selectedResource = ref(undefined);
const resourceData = ref([]);
const getClassificationType = async () => {
    const res = await queryClassificationType();
    if (res.success) {
        classificationType.value = res.result;
        activeKey.value = res.result?.[0]?.id;
        typeChange(activeKey.value);
    }
};

const getClassification = async (classificationTypeId) => {
    const params = {
        terms: [
            {
                column: 'classificationTypeId',
                termType: 'eq',
                value: classificationTypeId,
            },
        ],
    };
    const res = await queryClassification(params);
    if (res.success) {
        classification.value = res.result;
    }
};

const typeChange = async (key) => {
    getClassification(key);
};

const select = (key) => {
    selectedClassification.value = key;
    getTemplateList(key);
};

const chooseResource = async(data) => {
    const res = await queryTemplateDetail({
        terms:[{
            column: 'id',
            termType: 'eq',
            value: data.id
        }]
    })
    if(res.success && res.result.data?.length){
        selectedResource.value = res.result.data[0];
    }
    
};

const reselection = () => {
    selectedResource.value = undefined;
};

const getTemplateList = async (classification = undefined) => {
    const terms = [
        {
            column: 'type',
            termType: 'in',
            value: ['device','protocol'],
        },
    ];
    if (classification) {
        terms.push({
            column: 'id',
            termType: 'resource-bind$classification',
            value: [classification],
        });
    }
    const params = {
        paging:false,
        sorts: [
            {
                name: 'createTime',
                order: 'desc',
            },
        ],
        terms: terms,
    };
    const res = await queryTemplate(params);
    if (res.success) {
        resourceData.value = res.result || [];
    }
};

onMounted(() => {
    getClassificationType();
    getTemplateList();
});
</script>
<style lang="less" scoped>
.header {
    background-color: #fff;
    padding: 5px 10px;
    color: #7f7f7f;
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
        overflow-y: auto;
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
        height: 80px;
        width: 80px;
        margin-right: 8px;
    }
}
</style>

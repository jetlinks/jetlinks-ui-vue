<template>
  <j-page-container>
    <FullPage>
      <template v-if="!selectedResource">
        <div class="container">
          <div class="header">
            <a-row align="middle">
              <a-col :span="18">请选择资源</a-col>
            </a-row>
          </div>
          <div class="classificationType">
            <div
                v-for="item in classificationType"
                :key="item.id"
                :class="{
                                'header-button': true,
                                active: activeKey === item.id,
                            }"
                @click="() => typeChange(item.id)"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="content">
            <div class="left_search">
              <a-input
                  placeholder="请输入关键词"
                  allowClear
                  v-model:value="searchValue"
              >
                <template #suffix>
                  <AIcon  type="SearchOutlined"/>
                </template>
              </a-input>
              <SearchTree
                  :data="treeData"
                  :expandedKeys="expandedKeys"
                  @select="select"
              />
            </div>
            <div class="right_content">
              <div class="right_header">
                <TitleComponent
                    data="已安装资源"
                    style="margin-bottom: 0"
                />
                <a-input
                    placeholder="请输入关键字"
                    style="width: 30%"
                    v-model:value="searchParams"
                >
                  <template #suffix>
                    <AIcon @click="getTemplateList" type="SearchOutlined"/>
                  </template>
                </a-input>
              </div>
              <div class="right_list">
                <a-row
                    :gutter="[16, 16]"
                    v-if="resourceData.length"
                >
                  <a-col
                      :span="8"
                      v-for="i in resourceData"
                      :key="i.id"
                  >
                    <div
                        class="resource"
                        @click="() => chooseResource(i.id)"
                    >
                      <img
                          :src="
                                                    i.photoUrl?.url ||
                                                    imageMap.get(i.type?.value)
                                                "
                          alt=""
                          class="resourceImg"
                      />
                      <div style="margin-left: 10px">
                        <div>
                          <j-ellipsis>
                            {{ i.name }}
                          </j-ellipsis>
                        </div>
                        <div
                            style="
                                                        color: #8e8e8e;
                                                        margin-top: 20px;
                                                    "
                        >
                          <j-ellipsis>
                            {{ i.describe || '--' }}
                          </j-ellipsis>
                        </div>
                      </div>
                    </div>
                  </a-col>
                </a-row>
                <j-empty v-else></j-empty>
              </div>
            </div>
          </div>
        </div>
      </template>
      <Operation
          v-else
          :data="selectedResource"
          @reselection="reselection"
      ></Operation>
    </FullPage>
  </j-page-container>
</template>

<script setup>
import SearchTree from './components/SearchTree.vue';
import {
  queryClassificationType,
  queryClassification,
} from '@device-manager-ui/api/resource/quickCreate.ts';
import {queryTemplate, queryTemplateDetail} from '@device-manager-ui/api/resource/quickCreate.ts';
import Operation from './Operation.vue';
import {resource} from '@device-manager-ui/assets/resource';
import {treeFilter} from '@device-manager-ui/utils/tree';
import {cloneDeep} from 'lodash-es';

const route = useRoute();
const _id = route.query?.id;
const imageMap = new Map([
  ['device', resource.deviceDefaultImage],
  ['collector', resource.collectorDefaultImage],
  ['protocol', resource.protocolDefaultImage],
]);

const searchValue = ref();
const searchParams = ref('');
const activeKey = ref(undefined);
//分类类型
const classificationType = ref([]);
//分类数据
const allTreeData = ref([]);
const selectedClassification = ref();
const selectedResource = ref(undefined);
const resourceData = ref([]);
const expandedKeys = ref([]);
const treeData = computed(() => {
  const arr = cloneDeep(allTreeData.value)
  if (searchValue.value) {
    return treeFilter(
        arr,
        searchValue.value,
        'name'
    )
  }
  return arr
})

const getExpands = (arr, dt) => {
  arr.map(item => {
    dt.push(item.id)
    if(item?.children?.length){
      getExpands(item.children, dt)
    }
  })
}

const getClassificationType = async () => {
  const res = await queryClassificationType({sorts: [{ name: 'order', order: 'asc' }]});
  if (res.success) {
    classificationType.value = res.result;
    activeKey.value = res.result?.[0]?.id;
    typeChange(activeKey.value);
  }
};

const getClassification = async () => {
  const params = {
    terms: [],
  };
  if (activeKey.value) {
    params.terms.push({
      column: 'classificationTypeId',
      termType: 'eq',
      value: activeKey.value,
    });
  }
  const res = await queryClassification(params);
  if (res.success) {
    allTreeData.value = res.result;
  }
};

const typeChange = async (key) => {
  activeKey.value = key;
  getClassification();
  selectedClassification.value = undefined;
};

const select = (key) => {
  selectedClassification.value = key;
};

const chooseResource = async (id) => {
  const res = await queryTemplateDetail({
    terms: [
      {
        column: 'id',
        termType: 'eq',
        value: id,
      },
    ],
  });
  if (res.success && res.result.data?.length) {
    selectedResource.value = res.result.data[0];
  }
};

const reselection = () => {
  selectedResource.value = undefined;
};

const getTemplateList = async () => {
  const terms = searchParams.value
      ? [
        {
          column: 'type',
          termType: 'in',
          value: ['device', 'protocol'],
        },
        {
          column: 'name',
          termType: 'like',
          type: 'and',
          value: `%${searchParams.value}%`,
        },
      ]
      : [
        {
          column: 'type',
          termType: 'in',
          value: ['device', 'protocol'],
        },
      ];
  if (selectedClassification.value) {
    terms.push({
      "column": "id$resource-bind",
      "value": [
        {
          "column": "key$resources-classification",
          "value": [
            {
              "column": "id",
              "value": selectedClassification.value
            }
          ]
        }
      ],
      "type": "and"
    });
  } else if (activeKey.value) {
    terms.push({
      column: 'id$resource-bind',
      value: [
        {
          column: 'key$resources-classification',
          value: [
            {
              column: 'classificationTypeId',
              value: activeKey.value,
            },
          ],
        },
      ],
    });
  }
  const params = {
    paging: false,
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

watch(
    () => [selectedClassification.value, activeKey.value],
    () => {
      getTemplateList();
    },
);

watch(() => [searchValue.value, JSON.stringify(treeData.value)], () => {
  if (searchValue.value && treeData.value?.length) {
    const arr1 = []
    getExpands(treeData.value, arr1)
    expandedKeys.value = arr1
  }
}, {
  immediate: true
})

onMounted(() => {
  if (_id) {
    chooseResource(_id)
  }
  getClassificationType();
});
</script>
<style lang="less" scoped>
.container {
  padding: 20px;
  height: 100%;
}

.header {
  background-color: #fff;
  padding: 5px 10px;
  color: #7f7f7f;
}

.classificationType {
  background-color: rgba(210, 227, 252, 0.432);
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 12px;
  display: flex;

  .header-button {
    width: 100px;
    height: 40px;
    background-color: #fff;
    border-radius: 4px;
    margin-right: 12px;
    text-align: center;
    line-height: 40px;

    &.active {
      color: #1d39c4;
      border-bottom: 3px solid #3b5af5;
    }
  }
}

.content {
  display: flex;
  height: calc(100% - 90px);

  .left_search {
    flex: 1;
    padding: 0 10px;
    border-right: 1px solid #cdcdcd;
    height: 100%;
  }

  .right_content {
    flex: 3;
    padding: 0 20px;

    .right_list {
      overflow-y: auto;
      height: calc(100% - 40px);
      padding: 0 20px;
    }

    .right_header {
      display: flex;
      justify-content: space-around;
      margin-bottom: 16px;
    }
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

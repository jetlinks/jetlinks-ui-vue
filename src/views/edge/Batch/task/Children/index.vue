<template>
    <div class="container">
        <div class="header">
            <span
                >拖拽右侧边缘端设备卡片到左侧对应项区域框内，即可完成绑定</span
            >
        </div>
        <div>
          <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane v-for="item in options" :key="item.id"  >
              <template #tab>
                <badge-status
                  :status="item.state.value"
                  :text="item.label"
                  :statusNames="{
                            online: 'processing',
                            offline: 'error',
                            notActive: 'warning',
                        }"
                />
              </template>
            </a-tab-pane>
          </a-tabs>

        </div>
        <div class="content">
            <div class="left">
                <div>云端设备列表</div>
                <pro-search
                    :columns="columns"
                    type="simple"
                    @search="handleSearch"
                />
                <div class="left-list">
                    <a-table
                        :columns="columns"
                        :model="'TABLE'"
                        :dataSource="_dataSource"
                        :pagination="false"
                        :scroll="{ y: 500 }"
                    >
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'id'">
                                <j-ellipsis>
                                    {{
                                        record.id ? record.id : '自动生成'
                                    }}</j-ellipsis
                                >
                            </template>
                            <template v-else-if="column.key === 'Mapping'">
                                <div>
                                    {{
                                        record?.Mapping?.id
                                            ? '已映射'
                                            : '未映射'
                                    }}
                                </div>
                            </template>
                            <template v-else-if="column.key === 'MappingId'">
                                <div
                                    v-if="!record?.Mapping?.id"
                                    class="left-drag"
                                    @dragover.prevent
                                    @drop="(e) => onDrop(e, record)"
                                >
                                    从右侧拖拽卡片至此
                                </div>
                                <div v-else class="left-map">
                                    <div>
                                        <j-ellipsis>
                                            {{ record.Mapping.name }}({{
                                                record.Mapping.id
                                            }})</j-ellipsis
                                        >
                                    </div>
                                    <div @click="() => onDelete(record)">
                                        <AIcon type="DeleteOutlined" />
                                    </div>
                                </div>
                            </template>
                        </template>
                    </a-table>
                </div>

                <div class="left-bottom" @dragover.prevent @drop="onDropAuto">
                    未找到对应云端设备？拖动卡片到此处可在云端创建设备并自动绑定
                </div>
            </div>
            <div class="right">
                <div>边端未映射设备列表</div>
                <div class="right-list">
                    <div
                        v-for="item in edgeList"
                        class="right-item"
                        :draggable="true"
                        @dragstart="() => onStart(item)"
                    >
                        {{ item.name }}({{ item.id }})
                    </div>
                </div>
                <div class="right-bottom">
                    此标志表示该设备所属产品由云端模板创建，支持直接在云端生成对应设备
                </div>
            </div>
        </div>
    </div>
</template>

<script setup name="TaskChildren">
import { queryNoPagingPost } from '@/api/device/instance';
import { _queryByEdge } from '@/api/edge/batch';
const props = defineProps({
    options: {
        type: Array,
        default: () => [],
    },
    updateDevice: {
      type: Function,
      default: undefined
    }
});

const emit = defineEmits(['change']);

const _dataSource = ref([]);
const edgeList = ref([]);
const _drop = ref({});
const _dropList = ref([]);
const edgeId = ref('123');
const instanceId = ref('local');
const isFirst = ref(false);
const activeKey = ref('')

const options = computed(() => {
  return props.options
})

const columns = [
    {
        title: '设备ID',
        dataIndex: 'id',
        key: 'id',
        search: {
            type: 'string',
            defaultTermType: 'eq',
        },
    },
    {
        title: '设备名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
        ellipsis: true,
    },
    {
        title: '设备状态',
        key: 'Mapping',
        scopedSlots: true,
    },
    {
        title: '已映射边端设备ID',
        key: 'MappingId',
        width: 250,
        scopedSlots: true,
    },
];

const handleSearch = async (e) => {
    const terms = [
        {
            column: 'parentId',
            value: edgeId.value,
            termType: 'eq',
            type: 'and',
        },
    ];
    if (e?.terms.length) {
        terms.push(e.terms[0]);
    }
    const res = await queryNoPagingPost({
        paging: false,
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: terms,
    });

    if (res.success) {
        if (!isFirst.value) {
            const resp = await _queryByEdge(edgeId.value, instanceId.value, {
                terms: [
                    { column: 'key', value: '', termType: 'notnull' },
                ],
            });
            if (resp.success) {
                _dropList.value = resp.result;
            }
        }
        _dataSource.value = res.result.map((item) => {
            const isMap = _dropList.value?.find(
                (i) => i.id === item.id || i.mappingId === item.id,
            );
            if (isMap?.id) {
                return {
                    ...item,
                    Mapping: isMap,
                };
            } else {
                return item;
            }
        });
        if (!isFirst.value) {
            const _arr = _dataSource.value.filter((item) => item.Mapping?.id);
            _dropList.value = _arr
            emit('change', _arr);
        }
        isFirst.value = true;
    }
};

const getNoMapping = async () => {
    const res = await _queryByEdge(edgeId.value, instanceId.value, {
        terms: [{ column: 'key', value: '', termType: 'isnull' }],
    });
    if (res.success) {
        edgeList.value = res.result;
    }
};

const onStart = (item) => {
    _drop.value = item;
};

const onDrop = (e, item) => {
    item.Mapping = _drop.value;
    edgeList.value = edgeList.value.filter((i) => i.id !== _drop.value.id);
    _dropList.value.push(item);
    emit('change', _dropList.value);
};

const onDropAuto = () => {
    if (!_drop.value.masterProductId) {
        const obj = {
            id: '',
            name: _drop.value.name,
            Mapping: _drop.value,
        };
        edgeList.value = edgeList.value.filter((i) => i.id !== _drop.value.id);
        _dataSource.value.unshift(obj);
        _dropList.value.unshift(obj);
        emit('change', _dropList.value);
    }
};

const onDelete = (item) => {
    if (item.id) {
        edgeList.value.push(item.Mapping);
        item.Mapping = {};
        _dropList.value = _dropList.value.filter( (i) => i.id !== item.id,);
    } else {
        edgeList.value.push(item.Mapping);
        _dataSource.value = _dataSource.value.filter(
            (i) => i.Mapping?.id !== item.Mapping?.id,
        );
        _dropList.value = _dropList.value.filter( (i) => i.Mapping?.id !== item.Mapping?.id,);
    }
    emit('change', _dropList.value);
};

onMounted(() => {
    getNoMapping();
});
</script>

<style lang="less" scoped>
.container {
    .header {
        margin-bottom: 12px;
    }
    .content {
        display: flex;
        gap: 12px;
        .left {
            flex: 1;
            border: 1px solid #eee;
            padding: 12px;
            min-height: 600px;
            .left-list {
                height: 480px;
                .left-drag {
                    border: 1px dashed #c4c4c4;
                    padding: 12px;
                    text-align: center;
                }
                .left-map {
                    background-color: #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px;
                }
            }
            .left-bottom {
                height: 50px;
                line-height: 50px;
                padding: 0 12px;
                border: 1px dashed #c4c4c4;
            }
        }
        .right {
            width: 300px;
            border: 1px solid #eee;
            .right-list {
                padding: 12px;
                max-height: 600px;
                min-height: 600px;
                overflow-y: auto;
                .right-item {
                    height: 50px;
                    background-color: rgb(209, 209, 209);
                    margin-bottom: 10px;
                }
            }
        }
    }
}
</style>

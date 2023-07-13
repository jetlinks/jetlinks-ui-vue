<template>
    <j-modal
        visible
        title="选择触发场景"
        okText="确定"
        cancelText="取消"
        :width="1000"
        @cancel="closeModal"
        @ok="saveCorrelation"
    >
        <pro-search :columns="columns" @search="handleSearch" />
        <div style="height: 500px; overflow-y: auto">
            <JProTable
                model="CARD"
                :request="query"
                :rowSelection="{
                    selectedRowKeys: _selectedRowKeys,
                    onSelectNone: onSelectChange,
                    // onChange: onChange,
                }"
                :gridColumns="[1, 1, 1]"
                :defaultParams="{
                    sorts: [
                        {
                            name: 'createTime',
                            order: 'desc',
                        },
                    ],
                    terms,
                }"
                :params="params"
            >
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        :status="slotProps.state?.value"
                        :statusText="slotProps.state?.text"
                        :active="_selectedRowKeys.includes(slotProps.id)"
                        @click="handleClick"
                        :statusNames="{
                            started: 'processing',
                            disable: 'error',
                        }"
                        :disabled="slotProps.state?.value === 'disable'"
                    >
                        <template #type>
                            <span
                                ><img
                                    :height="16"
                                    :src="
                                        typeMap.get(slotProps.triggerType)?.icon
                                    "
                                    style="margin-right: 5px"
                                />{{
                                    typeMap.get(slotProps.triggerType)?.text
                                }}</span
                            >
                        </template>
                        <template #img>
                            <img
                                :src="typeMap.get(slotProps.triggerType)?.img"
                            />
                        </template>
                        <template #content>
                            <Ellipsis style="width: calc(100% - 100px)">
                                <span style="font-size: 16px; font-weight: 600">
                                    {{ slotProps.name }}
                                </span>
                            </Ellipsis>
                            <Ellipsis :lineClamp="2">
                                <div class="subTitle">
                                    说明：{{
                                        slotProps?.description ||
                                        typeMap.get(slotProps.triggerType)?.tip
                                    }}
                                </div>
                            </Ellipsis>
                        </template>
                    </CardBox>
                </template>
            </JProTable>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import { getImage, onlyMessage } from '@/utils/comm';
import { query } from '@/api/rule-engine/scene';
import { _execute } from '@/api/rule-engine/configuration';

const columns = [
    {
        title: '场景名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'select',
            options: async () => {
              const res = await query(
                  {
                        sorts: [
                          {
                            name: 'createTime',
                            order: 'desc',
                          },
                        ],
                        terms: [
                          {
                            column: 'id',
                            termType: 'alarm-bind-rule',
                            value: props.data?.id,
                          },
                          { column: 'triggerType', termType: 'eq', value: 'manual' }
                        ]
                      }
              );
              if (res.status === 200) {
                  return res.result.data.map((item: any) => ({
                      label: item.name,
                      value: item.id,
                  }));
              }
              return []
            }
        },
    },
    {
        title: '触发方式',
        dataIndex: 'triggerType',
        key: 'triggerType',
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        search: {
            type: 'select',
            options: [
                {
                    label: '正常',
                    value: 'started',
                },
                {
                    label: '禁用',
                    value: 'disable',
                },
            ],
        },
    },
];
const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const terms = [
    {
        terms: [
            {
                column: 'id',
                termType: 'alarm-bind-rule',
                value: props.data?.id,
            },
            {
                column: 'triggerType',
                termType: 'eq',
                value: props.data?.sceneTriggerType,
            },
        ],
        type: 'and',
    },
];

const params = ref();

const typeMap = new Map();
typeMap.set('manual', {
    text: '手动触发',
    img: getImage('/scene/scene-hand.png'),
    icon: getImage('/scene/trigger-type-icon/manual.png'),
    tip: '适用于第三方平台向物联网平台下发指令控制设备',
});

const _selectedRowKeys = ref<string[]>([]);

const handleClick = (dt: any) => {
   
    if(dt.state?.value === 'disable') {
        onlyMessage('该场景为禁用状态，无法触发告警','error')
        return
    }
    if (_selectedRowKeys.value.includes(dt.id)) {
        const _index = _selectedRowKeys.value.findIndex((i) => i === dt.id);
        _selectedRowKeys.value.splice(_index, 1);
    } else {
        _selectedRowKeys.value = [..._selectedRowKeys.value, dt.id];
    }
};
/**
 * 取消选择事件
 */
const onSelectChange = () => {
    _selectedRowKeys.value = [];
};

const handleSearch = (e: any) => {
    params.value = e;
};
const emit = defineEmits(['close', 'save']);
/**
 * 保存选中关联场景
 */
const saveCorrelation = async () => {
    if (_selectedRowKeys.value.length > 0) {
        const scene = _selectedRowKeys.value.map((i) => {
            return { id: i };
        });
        _execute(scene).then((res) => {
            if (res.status === 200) {
                onlyMessage('操作成功');
                emit('save');
            } else {
                onlyMessage('操作失败', 'error');
            }
        });
    } else {
        onlyMessage('请选择至少一条数据', 'error');
    }
};
const closeModal = () => {
    emit('close');
};
</script>
<style lang="less" scoped>
.subTitle {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    margin-top: 10px;
}
</style>
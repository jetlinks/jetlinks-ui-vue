<template>
    <j-modal
        visible
        title="新增"
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
                    onChange: onSelectChange
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
import { query } from '@/api/rule-engine/scene';
import { bindScene } from '@/api/rule-engine/configuration';
import { getImage, onlyMessage } from '@/utils/comm';
const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
    },
    {
        title: '触发方式',
        dataIndex: 'triggerType',
        key: 'triggerType',
        search: {
            type: 'select',
            options: [
                {
                    label: '手动触发',
                    value: 'manual',
                },
                {
                    label: '定时触发',
                    value: 'timer',
                },
                {
                    label: '设备触发',
                    value: 'device',
                },
            ],
        },
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
    id: {
        type: String,
    },
    type: {
        type: String,
    },
});
const terms = [
    {
        terms: [
            {
                column: 'id',
                termType: 'alarm-bind-rule$not',
                value: props.id,
                type: 'and',
            },
            {
                column: 'triggerType',
                termType: 'eq',
                value: props.type === 'other' ? undefined : 'device',
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
typeMap.set('timer', {
    text: '定时触发',
    img: getImage('/scene/scene-timer.png'),
    icon: getImage('/scene/trigger-type-icon/timing.png'),
    tip: '适用于定期执行固定任务',
});
typeMap.set('device', {
    text: '设备触发',
    img: getImage('/scene/scene-device.png'),
    icon: getImage('/scene/trigger-type-icon/device.png'),
    tip: '适用于设备数据或行为满足触发条件时，执行指定的动作',
});
const _selectedRowKeys = ref<string[]>([]);
const handleClick = (dt: any) => {
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
const onSelectChange = (arr: any[]) => {
    _selectedRowKeys.value = arr
};
const log = () => {};
log();
const handleSearch = (e: any) => {
    params.value = e;
};
const emit = defineEmits(['closeSave', 'saveScene']);
/**
 * 保存选中关联场景
 */
const saveCorrelation = async () => {
    if (_selectedRowKeys.value.length > 0) {
        const list = _selectedRowKeys.value.map((item: any) => {
            return {
                alarmId: props.id,
                ruleId: item,
            };
        });
        const res = await bindScene([...list]);
        if (res.status === 200) {
            onlyMessage('操作成功');
            emit('saveScene');
        }
    } else {
        onlyMessage('请选择至少一条数据', 'error');
    }
};
const closeModal = () => {
    emit('closeSave');
};
</script>
<style lang="less" scoped>
.subTitle {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    margin-top: 10px;
}
</style>
<template>
    <div class="alarm-log-card">
        <pro-search
            :columns="newColumns"
            :target="`alarm-log-${props.type}`"
            @search="search"
        />

        <FullPage>
            <JProTable
                :columns="columns"
                :request="handleSearch"
                :params="params"
                :gridColumns="[1, 1, 1]"
                :gridColumn="1"
                model="CARD"
                ref="tableRef"
            >
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        v-bind="slotProps"
                        :actions="getActions(slotProps, 'card')"
                        :status="slotProps.state.value"
                        :statusNames="{
                            warning: 'error',
                            normal: 'default',
                        }"
                        :statusText="slotProps.state.text"
                        @click="() => showDrawer(slotProps)"
                    >
                        <template #img>
                            <img
                                :src="imgMap.get(slotProps.targetType)"
                                alt=""
                            />
                        </template>
                        <template #content>
                            <div class="alarmTitle">
                                <div class="alarmName">
                                    <Ellipsis style="width: 100%">
                                        <span
                                            style="
                                                font-weight: 500;
                                                font-size: 16px;
                                            "
                                        >
                                            {{ slotProps.alarmName }}
                                        </span>
                                    </Ellipsis>
                                </div>
                                <!-- <div
                                    class="alarmLevel"
                                    :style="{
                                        backgroundColor: levelColorMap.get(
                                            'level' + slotProps.level,
                                        ),
                                    }"
                                >
                                    <Ellipsis>
                                        <span>
                                            {{
                                                levelMap?.[slotProps.level] ||
                                                slotProps.level
                                            }}
                                        </span>
                                    </Ellipsis>
                                </div> -->
                                <LevelIcon :level="slotProps.level"></LevelIcon>
                            </div>
                            <j-row :gutter="24">
                                <j-col
                                    :span="
                                        props.type === 'device' ||
                                        slotProps.targetType === 'device'
                                            ? 6
                                            : 8
                                    "
                                    class="content-left"
                                >
                                    <div class="content-title">告警维度</div>
                                    <Ellipsis
                                        ><div>
                                            {{ slotProps?.targetName }}
                                        </div></Ellipsis
                                    >
                                </j-col>
                                <j-col
                                    :span="
                                        props.type === 'device' ||
                                        slotProps.targetType === 'device'
                                            ? 6
                                            : 8
                                    "
                                >
                                    <div class="content-title">
                                        最近告警时间
                                    </div>
                                    <Ellipsis>
                                        <div>
                                            {{
                                                dayjs(
                                                    slotProps?.alarmTime,
                                                ).format(
                                                    'YYYY-MM-DD HH:mm:ss',
                                                ) +
                                                '至' +
                                                (slotProps?.state?.value ===
                                                'warning'
                                                    ? '当前时间'
                                                    : dayjs(
                                                          slotProps?.handleTime,
                                                      ).format(
                                                          'YYYY-MM-DD HH:mm:ss',
                                                      ))
                                            }}
                                        </div>
                                    </Ellipsis>
                                </j-col>
                                <j-col
                                    :span="
                                        props.type === 'device' ||
                                        slotProps.targetType === 'device'
                                            ? 6
                                            : 8
                                    "
                                >
                                    <div class="content-title">
                                        告警持续时长
                                    </div>
                                    <Ellipsis
                                        ><Duration :data="slotProps"></Duration
                                    ></Ellipsis>
                                </j-col>
                                <j-col
                                    :span="6"
                                    v-if="
                                        props.type === 'device' ||
                                        slotProps.targetType === 'device'
                                    "
                                >
                                    <div class="content-title">告警原因</div>
                                    <Ellipsis
                                        ><div>
                                            {{ slotProps?.actualDesc || '--' }}
                                        </div></Ellipsis
                                    >
                                </j-col>
                            </j-row>
                        </template>
                        <template #actions="item">
                            <PermissionButton
                                :disabled="
                                    item.key === 'solve' &&
                                    slotProps.state.value === 'normal'
                                "
                                :tooltip="{
                                    ...item.tooltip,
                                }"
                                @click="item.onClick"
                                :hasPermission="
                                    item.key == 'solve'
                                        ? 'rule-engine/Alarm/Log:action'
                                        : 'rule-engine/Alarm/Log:view'
                                "
                            >
                                <AIcon :type="item.icon" />
                                <span>{{ item?.text }}</span>
                            </PermissionButton>
                        </template>
                    </CardBox>
                </template>
            </JProTable>
        </FullPage>
        <SolveComponent
            :data="data.current"
            v-if="data.solveVisible"
            @closeSolve="closeSolve"
            @refresh="refresh"
        />
        <LogDrawer
            v-if="visibleDrawer"
            :logData="drawerData"
            :typeMap="titleMap"
            :levelMap="levelMap"
            @closeDrawer="visibleDrawer = false"
            @refreshTable="refreshTable"
        />
    </div>
</template>

<script lang="ts" setup>
import { getImage } from '@/utils/comm';
import { getOrgList, query, getAlarmProduct } from '@/api/rule-engine/log';
import { useAlarmStore } from '@/store/alarm';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import type { ActionsType } from '@/components/Table';
import SolveComponent from '../SolveComponent/index.vue';
import { useMenuStore } from '@/store/menu';
import LogDrawer from './components/DetailDrawer.vue';
import Duration from '../components/Duration.vue';
import { useAlarmLevel } from '@/hook';
import LevelIcon from '../../Config/LevelIcon.vue';
const menuStory = useMenuStore();
const tableRef = ref();
const { levelMap, levelList } = useAlarmLevel();
const alarmStore = useAlarmStore();
const { data } = storeToRefs(alarmStore);
const drawerData = ref();
const visibleDrawer = ref(false);
const props = defineProps<{
    type: string;
    id?: string;
}>();

const imgMap = new Map();
imgMap.set('product', getImage('/alarm/product.png'));
imgMap.set('device', getImage('/alarm/device.png'));
imgMap.set('other', getImage('/alarm/other.png'));
imgMap.set('org', getImage('/alarm/org.png'));

const titleMap = new Map();
titleMap.set('product', '产品');
titleMap.set('device', '设备');
titleMap.set('other', '其他');
titleMap.set('org', '组织');

const levelColorMap = new Map();
levelColorMap.set('level1', 'rgba(229, 0,  18 )');
levelColorMap.set('level2', 'rgba(255, 148,  87)');
levelColorMap.set('level3', 'rgba(250, 189,  71)');
levelColorMap.set('level4', 'rgba(153, 153, 153)');
levelColorMap.set('level5', 'rgba(196, 196,  196)');

const columns = [
    {
        title: '配置名称',
        dataIndex: 'alarmName',
        key: 'alarmName',
    },
    {
        title: '类型',
        dataIndex: 'targetType',
        key: 'targetType',
        scopedSlots: true,
    },
    {
        title: '关联场景联动',
        dataIndex: 'sourceName',
        key: 'sourceName',
    },
    {
        title: '告警级别',
        dataIndex: 'level',
        key: 'level',
        width: 200,
        search: {
            type: 'select',
            options: async () => {
                return levelList.value;
            },
        },
        scopedSlots: true,
    },
    {
        title: '最近告警时间',
        dataIndex: 'alarmTime',
        key: 'alarmTime',
        search: {
            type: 'date',
        },
        scopedSlots: true,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        search: {
            type: 'select',
            options: [
                {
                    label: '告警中',
                    value: 'warning',
                },
                {
                    label: '无告警',
                    value: 'normal',
                },
            ],
        },
        scopedSlots: true,
    },
    {
        title: '操作',
        dateIndex: 'actions',
        key: 'actions',
        scopedSlots: true,
        width: 200,
    },
];

const newColumns = computed(() => {
    const otherColumns = {
        title: '产品名称',
        dataIndex: 'targetName',
        key: 'targetName',
        search: {
            type: 'string',
        },
    };

    switch (props.type) {
        case 'device':
            otherColumns.title = '设备名称';
            break;
        case 'org':
            otherColumns.title = '组织名称';
            break;
        case 'other':
            otherColumns.title = '场景名称';
            break;
    }
    if (props.type === 'device') {
        const productColumns = {
            title: '产品名称',
            dataIndex: 'product_id',
            key: 'product_id',
            search: {
                type: 'select',
                options: async () => {
                    const termType = [
                        {
                            column: 'id$alarm-record',
                            value: [
                                {
                                    column: 'targetType',
                                    termType: 'eq',
                                    value: 'device',
                                },
                            ],
                        },
                    ];
                    const resp: any = await getAlarmProduct({
                        sorts: [{ name: 'alarmTime', order: 'desc' }],
                        terms: termType,
                    });
                    const listMap: Map<string, any> = new Map();

                    if (resp.status === 200) {
                        resp.result.data.forEach((item) => {
                            if (item.productId) {
                                listMap.set(item.productId, {
                                    label: item.productName,
                                    value: item.productId,
                                });
                            }
                        });
                        return [...listMap.values()];
                    }
                    return [];
                },
            },
        };
        return [otherColumns, productColumns, ...columns];
    }
    return ['all', 'detail'].includes(props.type)
        ? columns
        : [otherColumns, ...columns];
});

let params: any = ref({
    sorts: [{ name: 'alarmTime', order: 'desc' }],
    terms: [],
});
const handleSearch = async (params: any) => {
    const resp: any = await query(params);
    if (resp.status === 200) {
        const res: any = await getOrgList();
        if (res.status === 200) {
            resp.result.data.map((item: any) => {
                if (item.targetType === 'org') {
                    res.result.forEach((item2: any) => {
                        if (item2.id === item.targetId) {
                            item.targetName = item2.name;
                        }
                        //targetName处理之后的
                        if (item.targetId === item.targetName) {
                            item.targetName = '无';
                        }
                    });
                }
            });
            return resp;
        }
    }
};

const search = (data: any) => {
    params.value.terms = [...data?.terms];
    if (props.type !== 'all' && !props.id) {
        params.value.terms.push({
            termType: 'eq',
            column: 'targetType',
            value: props.type,
            type: 'and',
        });
    }
    if (props.type === 'device') {
        data?.terms.forEach((i: any, _index: number) => {
            i.terms.forEach((item: any, index: number) => {
                if (item.column === 'product_id') {
                    params.value.terms[_index].terms[index] = {
                        column: 'targetId$dev-instance',
                        value: [data?.terms[0]?.terms[0]],
                    };
                }
            });
        });
    }
    if (props.id) {
        params.value.terms.push({
            termType: 'eq',
            column: 'alarmConfigId',
            value: props.id,
            type: 'and',
        });
    }
};

const getActions = (
    currentData: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!currentData) return [];
    const actions = [
        {
            key: 'solve',
            text: '告警处理',
            tooltip: {
                title:
                    currentData.state?.value === 'normal'
                        ? '无告警'
                        : '告警处理',
            },
            icon: 'ToolOutlined',
            onClick: () => {
                data.value.current = currentData;
                data.value.solveVisible = true;
            },
        },
        {
            key: 'log',
            text: '告警日志',
            tooltip: {
                title: '告警日志',
            },
            icon: 'FileOutlined',
            onClick: () => {
                menuStory.jumpPage(`rule-engine/Alarm/Log/Detail`, {
                    id: currentData.id,
                });
            },
        },
        {
            key: 'detail',
            text: '处理记录',
            tooltip: {
                title: '处理记录',
            },
            icon: 'FileTextOutlined',
            onClick: () => {
                menuStory.jumpPage(
                    'rule-engine/Alarm/Log/Record',
                    {},
                    { id: currentData.id },
                );
            },
        },
    ];
    return actions;
};
/**
 * 关闭告警日志
 */
const closeSolve = () => {
    data.value.solveVisible = false;
};
const refresh = () => {
    data.value.solveVisible = false;
    tableRef.value.reload(params.value);
};

const refreshTable = () => {
    tableRef.value.reload(params.value);
};
const showDrawer = (data: any) => {
    if (data.targetType === 'device') {
        drawerData.value = data;
        visibleDrawer.value = true;
    }
};
onMounted(() => {
    if (props.type !== 'all' && !props.id) {
        params.value.terms = [
            {
                termType: 'eq',
                column: 'targetType',
                value: props.type,
                type: 'and',
            },
        ];
    }
    if (props.id) {
        params.value.terms = [
            {
                termType: 'eq',
                column: 'alarmConfigId',
                value: props.id,
                type: 'and',
            },
        ];
    }
    if (props.type === 'all') {
        params.value.terms = [];
    }
});
</script>
<style lang="less" scoped>
.content-title {
    color: #666;
    font-size: 12px;
}
.alarmTitle {
    display: flex;
    width: 30%;

    .alarmLevel {
        width: 30%;
        text-align: center;
        padding: 5px;
    }
    .alarmName {
        max-width: 30%;
        color: #1a1a1a;
        margin-right: 10px;
    }
}
</style>

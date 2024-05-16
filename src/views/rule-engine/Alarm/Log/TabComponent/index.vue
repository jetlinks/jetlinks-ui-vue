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
                :gridColumns="[1, 1, 2]"
                :gridColumn="2"
                ref="tableRef"
            >
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        v-bind="slotProps"
                        :actions="getActions(slotProps, 'card')"
                        :statusText="
                            data.defaultLevel.find(
                                (i) => i.level === slotProps.level,
                            )?.title || slotProps.level
                        "
                        :status="slotProps.level"
                        :statusNames="{
                            1: 'level1',
                            2: 'level2',
                            3: 'level3',
                            4: 'level4',
                            5: 'level5',
                        }"
                        :customBadge="true"
                    >
                        <template #img>
                            <img
                                :src="imgMap.get(slotProps.targetType)"
                                alt=""
                            />
                        </template>
                        <template #content>
                            <Ellipsis style="width: calc(100% - 100px)">
                                <span style="font-weight: 500">
                                    {{ slotProps.alarmName }}
                                </span>
                            </Ellipsis>
                            <j-row :gutter="24">
                                <j-col :span="8" class="content-left">
                                    <div class="content-left-title">
                                        {{ titleMap.get(slotProps.targetType) }}
                                    </div>
                                    <Ellipsis
                                        ><div>
                                            {{ slotProps?.targetName }}
                                        </div></Ellipsis
                                    >
                                </j-col>
                                <j-col :span="8">
                                    <div class="content-right-title">
                                        最近告警时间
                                    </div>
                                    <Ellipsis
                                        ><div>
                                            {{
                                                dayjs(
                                                    slotProps?.alarmTime,
                                                ).format('YYYY-MM-DD HH:mm:ss')
                                            }}
                                        </div></Ellipsis
                                    >
                                </j-col>
                                <j-col :span="8">
                                    <div class="content-right-title">状态</div>
                                    <BadgeStatus
                                        :status="slotProps.state.value"
                                        :statusName="{
                                            warning: 'warning',
                                            normal: 'default',
                                        }"
                                    >
                                    </BadgeStatus
                                    ><span
                                        :style="
                                            slotProps.state.value === 'warning'
                                                ? 'color: #E50012'
                                                : 'color:black'
                                        "
                                    >
                                        {{ slotProps.state.text }}
                                    </span>
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
                <template #targetType="slotProps">
                    {{ titleMap.get(slotProps.targetType) }}
                </template>
                <template #alarmTime="slotProps">
                   {{ dayjs(slotProps.alarmTime).format('YYYY-MM-DD HH:mm:ss')}}
                </template>
                <template #level="slotProps">
                    <Ellipsis style="width: calc(100% - 20px)">
                        {{ data.defaultLevel.find((i)=>{
                            return i.level === slotProps.level
                        }).title}}
                    </Ellipsis>
                </template>
                <template #state="slotProps">
                    <BadgeStatus
                        :status="slotProps.state.value"
                        :statusName="{
                            warning: 'warning',
                            normal: 'default',
                        }"
                    >
                    </BadgeStatus
                    ><span
                        :style="
                            slotProps.state.value === 'warning'
                                ? 'color: #E50012'
                                : 'color:black'
                        "
                    >
                        {{ slotProps.state.text }}
                    </span>
                </template>
                <template #actions="slotProps">
                    <j-space>
                        <template
                            v-for="i in getActions(slotProps, 'table')"
                            :key="i.key"
                        >
                            <PermissionButton
                                type="link"
                                :disabled="
                                    i.key === 'solve' &&
                                    slotProps.state.value === 'normal'
                                "
                                :tooltip="{
                                    ...i.tooltip,
                                }"
                                @click="i.onClick"
                                :hasPermission="
                                    i.key == 'solve'
                                        ? 'rule-engine/Alarm/Log:action'
                                        : 'rule-engine/Alarm/Log:view'
                                "
                            >
                                <template #icon>
                                    <AIcon :type="i.icon" />
                                </template>
                            </PermissionButton>
                        </template>
                    </j-space>
                </template>
            </JProTable>
        </FullPage>
        <SolveComponent
            :data="data"
            v-if="data.solveVisible"
            @closeSolve="closeSolve"
        />
    </div>
</template>

<script lang="ts" setup>
import { getImage } from '@/utils/comm';
import { getOrgList, query, getAlarmProduct } from '@/api/rule-engine/log';
import { queryLevel } from '@/api/rule-engine/config';
import { useAlarmStore } from '@/store/alarm';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import type { ActionsType } from '@/components/Table';
import SolveComponent from '../SolveComponent/index.vue';
import { useMenuStore } from '@/store/menu';
import { usePermissionStore } from '@/store/permission';
const menuStory = useMenuStore();
const tableRef = ref();
const alarmStore = useAlarmStore();
const { data } = storeToRefs(alarmStore);

const getDefaultLevel = () => {
    queryLevel().then((res) => {
        if (res.status === 200) {
            data.value.defaultLevel = res.result?.levels || [];
        }
    });
};
getDefaultLevel();
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
const columns = [
    {
        title:'配置名称',
        dataIndex:'alarmName',
        key:'alarmName',
    },{
        title:'类型',
        dataIndex:'targetType',
        key:'targetType',
        scopedSlots:true
    },
    {
        title:'关联场景联动',
        dataIndex:'sourceName',
        key:'sourceName',

    },
    {
        title: '告警级别',
        dataIndex: 'level',
        key: 'level',
        width:200,
        search: {
            type: 'select',
            options: data.value.defaultLevel.map((item: any) => {
                return {
                    label: item.title,
                    value: item.level,
                };
            }),
        },
        scopedSlots: true
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
        dataIndex: 'targetId',
        key: 'targetId',
        search: {
            type: 'select',
            options: async () => {
                const termType = [
                    {
                        column: 'targetType',
                        termType: 'eq',
                        type: 'and',
                        value: props.type,
                    },
                ];

                if (props.id) {
                    termType.push({
                        termType: 'eq',
                        column: 'alarmConfigId',
                        value: props.id,
                        type: 'and',
                    });
                }

                const resp: any = await handleSearch({
                    sorts: [{ name: 'alarmTime', order: 'desc' }],
                    terms: termType,
                });
                const listMap: Map<string, any> = new Map();

                if (resp.status === 200) {
                    resp.result.data.forEach((item) => {
                        if (item.targetId) {
                            listMap.set(item.targetId, {
                                label: item.targetName,
                                value: item.targetId,
                            });
                        }
                    });

                    return [...listMap.values()];
                }
                return [];
            },
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
    if (
        props.type === 'device' &&
        data?.terms[0]?.terms[0]?.column === 'product_id'
    ) {
        params.value.terms = [
            {
                column: 'targetId$dev-instance',
                value: [data?.terms[0]?.terms[0]],
            },
        ];
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
            // popConfirm: {
            //     title: !usePermissionStore().hasPermission(
            //         'rule-engine/Alarm/Log:action',
            //     )
            //         ? '暂无权限，请联系管理员'
            //         : data.state?.value === 'normal'
            //         ? '无告警'
            //         : '',
            // },
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
    tableRef.value.reload(params.value);
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
.content-left {
    border-right: 0.2px solid rgba(0, 0, 0, 0.2);
}
.content-right-title {
    color: #666;
    font-size: 12px;
}
.content-left-title {
    font-size: 18px;
}
</style>

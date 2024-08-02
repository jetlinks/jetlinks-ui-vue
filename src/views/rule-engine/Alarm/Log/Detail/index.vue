<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="alarm-log-detail"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                :columns="columns"
                model="TABLE"
                ref="tableRef"
                :request="queryList"
                :params="params"
                :defaultParams="{
                    terms,
                    sorts: [{ name: 'alarmTime', order: 'desc' }],
                }"
            >
                <template #alarmTime="slotProps">{{
                    dayjs(slotProps.alarmTime).format('YYYY-MM-DD HH:mm:ss')
                }}</template>
                <template #sourceId="slotProps"
                    >设备ID：<a-button
                        type="link"
                        @click="() => gotoDevice(slotProps.sourceId)"
                        >{{ slotProps.sourceId }}</a-button
                    ></template
                >
                <template #action="slotProps">
                    <j-space :size="16"
                        ><template
                            v-for="i in getActions(slotProps, 'table')"
                            :key="i.key"
                        >
                            <PermissionButton
                                :disabled="i.disabled"
                                :popConfirm="i.popConfirm"
                                :tooltip="{
                                    ...i.tooltip,
                                }"
                                @click="i.onClick"
                                type="link"
                                style="padding: 0px"
                            >
                                <template #icon
                                    ><AIcon :type="i.icon"
                                /></template>
                            </PermissionButton>
                        </template>
                    </j-space>
                </template>
            </JProTable>
        </FullPage>
        <Info
            v-if="visible && alarmType !== 'device'"
            :data="current"
            @close="close"
        />
        <LogDetail
            v-if="visible && alarmType === 'device'"
            :data="current"
            @close="close"
        />
    </page-container>
</template>

<script lang="ts" setup>
import { detail, queryLogList } from '@/api/rule-engine/log';
import { detail as configurationDetail } from '@/api/rule-engine/configuration';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import { useAlarmStore } from '@/store/alarm';
import Info from './info.vue';
import { useRouterParams } from '@/utils/hooks/useParams';
import { useMenuStore } from 'store/menu';
import LogDetail from '../TabComponent/components/LogDetail.vue';
const route = useRoute();
const id = route.params?.id;
const menuStory = useMenuStore();
const { params: routerParams } = useRouterParams();
const visible = ref(false);
const tableRef = ref();
const params = ref({});
const alarmStore = useAlarmStore();
const { data } = alarmStore;
const current = ref(); // 当前告警记录信息
const details = ref(); // 告警记录的详情
const alarmType = ref();
const columns = ref([
    {
        title: '告警时间',
        dataIndex: 'alarmTime',
        key: 'alarmTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: '告警名称',
        dataIndex: 'alarmConfigName',
        key: 'alarmConfigName',
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        scopedSlots: true,
    },
]);
const getActions = (
    data: Partial<Record<string, any>>,
    type?: 'table',
): any[] => {
    if (!data) {
        return [];
    }
    const actions = [
        {
            key: 'view',
            text: '查看',
            tooltip: {
                title: '查看',
            },
            icon: 'EyeOutlined',
            onClick: () => {
                current.value = data;
                visible.value = true;
            },
        },
    ];
    return actions;
};
const terms = [
    {
        column: 'alarmRecordId',
        termType: 'eq$not',
        value: id,
        type: 'and',
    },
];
/**
 * 获取详情列表
 */
const queryList = async (params: any) => {
    if (data.current?.alarmConfigId) {
        const res: any = await queryLogList(data.current?.alarmConfigId, {
            ...params,
            // sorts: [{ name: 'alarmTime', order: 'desc' }],
        });
        if (res.status === 200 && res.result?.data) {
            details.value = res.result.data[0];
            return {
                code: res.message,
                result: {
                    data: res.result.data,
                    pageIndex: res.result.pageIndex,
                    pageSize: res.result.pageSize,
                    total: res.result.total,
                },
                status: res.status,
            };
        }
    } else {
        return {
            code: 200,
            result: {
                data: [],
                pageIndex: 0,
                pageSize: 0,
                total: 0,
            },
            status: 200,
        };
    }
};
const gotoDevice = (id) => {
    menuStory.jumpPage('device/Instance/Detail', { id, tab: 'Running' });
};
/**
 * 根据id初始化数据
 */

watch(
    () => id,
    async () => {
        const res = await detail(id);
        if (res.status === 200) {
            data.current = res.result || {};
            tableRef.value?.reload();
            alarmType.value = res.result?.targetType;
            if (alarmType.value === 'device') {
                columns.value = [
                    {
                        title: '告警时间',
                        dataIndex: 'alarmTime',
                        key: 'alarmTime',
                        scopedSlots: true,
                        search: {
                            type: 'date',
                        },
                    },
                    {
                        title: '触发条件',
                        dataIndex: 'triggerDesc',
                        key: 'triggerDesc',
                    },
                    {
                        title: '告警源',
                        dataIndex: 'sourceId',
                        key: 'sourceId',
                        scopedSlots: true,
                        search: {
                            type: 'string',
                        },
                    },
                    {
                        title: '告警原因',
                        dataIndex: 'actualDesc',
                        key: 'actualDesc',
                        scopedSlots: true,
                        search: {
                            type: 'string',
                        },
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        key: 'action',
                        scopedSlots: true,
                    },
                ];
            }
        }
    },
    {
        deep: true,
        immediate: true,
    },
);
const handleSearch = (_params: any) => {
    params.value = _params;
};

/**
 * 关闭模态弹窗
 */
const close = () => {
    visible.value = false;
};

watchEffect(() => {
    current.value = details.value;
    if (routerParams.value.detail && details.value) {
        visible.value = true;
    }
});
</script>
<style lang="less" scoped></style>

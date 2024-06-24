<template>
    <a-table
        :dataSource="dataSource"
        :columns="columns"
        :pagination="false"
        :scroll="{ y: 'calc(100vh - 260px)' }"
    >
        <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'alarmTime'"
                ><span
                    >{{ dayjs(text).format('YYYY-MM-DD HH:mm:ss')
                    }}<a-button type="text" @click="() => showDetail(record)">
                        <template #icon>
                            <AIcon type="FileSearchOutlined"></AIcon>
                        </template> </a-button></span
            ></template>
            <template v-if="column.dataIndex === 'sourceId'">
                <Ellipsis>
                    设备ID：
                    <span class="deviceId" @click="() => gotoDevice(text)">{{
                        text
                    }}</span></Ellipsis
                >
            </template>
            <template
                v-if="
                    column.dataIndex === 'triggerDesc' ||
                    column.dataIndex === 'actualDesc'
                "
                ><Ellipsis>{{ text }}</Ellipsis></template
            >
        </template></a-table
    >
    <div class="tableBottom">
        <a-button
            v-if="exceed"
            class="moreBtn"
            type="text"
            @click="gotoAlarmLog"
            >查看更多 ></a-button
        >
    </div>
    <LogDetail v-if="visibleDetail" :data="current" @close="close" />
</template>

<script setup>
import { queryLogList } from '@/api/rule-engine/log';
import dayjs from 'dayjs';
import { useMenuStore } from 'store/menu';
import LogDetail from './LogDetail.vue';
const props = defineProps({
    currentId: {
        type: String,
        default: '',
    },
    configId: {
        type: String,
        default: '',
    },
});
const menuStory = useMenuStore();
const exceed = ref();
const visibleDetail = ref(false);
const dataSource = ref([]);
const current = ref();
const columns = [
    {
        title: '告警时间',
        dataIndex: 'alarmTime',
        key: 'alarmTime',
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
    },
    {
        title: '告警原因',
        dataIndex: 'actualDesc',
        key: 'actualDesc',
    },
];
const queryData = async () => {
    const res = await queryLogList(props.configId, {
        pageIndex: 0,
        pageSize: 51,
        terms: [
            {
                column: 'alarmRecordId',
                termType: 'eq',
                value: props.currentId,
                type: 'and',
            },
        ],
        sorts: [
            {
                name: 'alarmTime',
                order: 'desc',
            },
        ],
    });
    if (res.success) {
        if (res.result.data?.length > 50) {
            exceed.value = true;
            dataSource.value = res.result.data.slice(0, 50);
        } else {
            exceed.value = false;
            dataSource.value = res.result.data;
        }
    }
};

const gotoDevice = (id) => {
    menuStory.jumpPage('device/Instance/Detail', { id, tab: 'Running' });
};
const showDetail = (data) => {
    visibleDetail.value = true;
    current.value = data;
};
const close = () => {
    visibleDetail.value = false;
};
const gotoAlarmLog = () => {
    menuStory.jumpPage(`rule-engine/Alarm/Log/Detail`, {
        id: props.currentId,
    });
};
onMounted(() => {
    queryData();
});
</script>
<style lang="less" scoped>
.tableBottom {
    text-align: center;
    position: relative;
    height: 50px;
    .moreBtn {
        position: absolute;
        right: 0;
        top: 10px;
    }
}
.deviceId {
    cursor: pointer;
    color:#4096FF;
}
</style>

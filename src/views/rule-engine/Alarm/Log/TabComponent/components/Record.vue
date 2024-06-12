<template>
    <a-table
        :dataSource="dataSource"
        :columns="columns"
        :pagination="false"
        :scroll="{ y: 'calc(100vh - 260px)' }"
    >
        <template #bodyCell="{ column, text, record }">
            <template
                v-if="['alarmTime', 'handleTime'].includes(column.dataIndex)"
            >
                {{ dayjs(text).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template v-if="column.dataIndex === 'duration'">
                {{
                    record?.handleTime
                        ? calculateDuration(
                              dayjs(record.alarmTime),
                              dayjs(record?.handleTime),
                          )
                        : calculateDuration(dayjs(record.alarmTime), dayjs())
                }}
            </template>
            <template v-if="column.dataIndex === 'handleType'">
                {{ text.text }}
            </template>
            <template v-if="column.dataIndex === 'description'">
                <Ellipsis>
                    {{ text || '--' }}
                </Ellipsis>
            </template>
        </template>
    </a-table>
    <div class="tableBottom">
        <a-button v-if="exceed" class="moreBtn" type="text">查看更多 ></a-button>
    </div>
</template>

<script setup>
import { queryHandleHistory } from '@/api/rule-engine/log';
import dayjs from 'dayjs';
const props = defineProps({
    currentId: {
        type: String,
        default: '',
    },
});
const isLastRow = (index) => {
    // Calculate if the row is the last row based on the current scroll position
    const tableBody = document.querySelector('.ant-table-body');
    if (tableBody) {
        const scrollPosition = tableBody.scrollTop;
        const totalHeight = tableBody.scrollHeight;
        const visibleHeight = tableBody.clientHeight;
        const bottomOffset = totalHeight - visibleHeight;
        return (
            scrollPosition >= bottomOffset &&
            index === this.dataSource.length - 1
        );
    }
    return false;
};
const exceed = ref();
const dataSource = ref([]);
const columns = [
    {
        title: '告警时间',
        dataIndex: 'alarmTime',
        key: 'alarmTime',
    },
    {
        title: '处理时间',
        dataIndex: 'handleTime',
        key: 'handleTime',
    },
    {
        title: '告警持续时长',
        dataIndex: 'duration',
        key: 'duration',
    },
    {
        title: '处理类型',
        dataIndex: 'handleType',
        key: 'handleType',
    },
    {
        title: '处理结果',
        dataIndex: 'description',
        key: 'description',
    },
];
const queryList = async () => {
    const res = await queryHandleHistory({
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [
            {
                column: 'alarmRecordId',
                termType: 'eq',
                value: props.currentId,
                type: 'and',
            },
        ],
        pageIndex: 0,
        pageSize: 51,
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
const calculateDuration = (startTime, endTime) => {
    const diffInSeconds = endTime.diff(startTime, 'second');
    let result;

    if (diffInSeconds < 60) {
        result = `${diffInSeconds.toFixed(1)} s`;
    } else if (diffInSeconds < 3600) {
        result = `${(diffInSeconds / 60).toFixed(1)} min`;
    } else {
        result = `${(diffInSeconds / 3600).toFixed(1)} h`;
    }
    return result;
};
onMounted(() => {
    queryList();
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
</style>

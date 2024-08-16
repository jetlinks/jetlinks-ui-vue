<template>
    <a-table
        :dataSource="dataSource"
        :columns="columns"
        :pagination="false"
        bordered
        :scroll="{ y: 'calc(100vh - 260px)' }"
    >
        <template #bodyCell="{ column, text, record }">
            <template
                v-if="['alarmTime', 'handleTime'].includes(column.dataIndex)"
            >
                {{ dayjs(text).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template v-if="column.dataIndex === 'duration'">
                <Duration :data="record" />
            </template>
            <template v-if="column.dataIndex === 'handleType'">
                {{ text?.text }}
            </template>
            <template v-if="column.dataIndex === 'description'">
                <Ellipsis>
                    {{ text || '--' }}
                </Ellipsis>
            </template>
        </template>
    </a-table>
    <div class="tableBottom">
        <a-button
            v-if="exceed"
            class="moreBtn"
            type="link"
            @click="gotoAlarmRecord"
            >{{ $t('components.Record.891295-0') }} ></a-button
        ><span v-else-if="dataSource.length">{{ $t('components.Record.891295-1') }}</span>
    </div>
</template>

<script setup>
import { queryHandleHistory } from '@/api/rule-engine/log';
import dayjs from 'dayjs';
import { useMenuStore } from 'store/menu';
import { defineExpose } from 'vue';
import Duration from '../../components/Duration.vue';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const props = defineProps({
    currentId: {
        type: String,
        default: '',
    },
});
const exceed = ref();
const dataSource = ref([]);
const menuStory = useMenuStore();
const columns = [
    {
        title: $t('components.Record.891295-2'),
        dataIndex: 'alarmTime',
        key: 'alarmTime',
    },
    {
        title: $t('components.Record.891295-3'),
        dataIndex: 'handleTime',
        key: 'handleTime',
    },
    {
        title: $t('components.Record.891295-4'),
        dataIndex: 'duration',
        key: 'duration',
    },
    {
        title: $t('components.Record.891295-5'),
        dataIndex: 'handleType',
        key: 'handleType',
    },
    {
        title: $t('components.Record.891295-6'),
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
const gotoAlarmRecord = () => {
    menuStory.jumpPage(
        'rule-engine/Alarm/Log/Record',
        {},
        { id: props.currentId },
    );
};
const refreshRecord = () => {
    queryList();
};
defineExpose({
    refreshRecord,
});
onMounted(() => {
    queryList();
});
</script>
<style lang="less" scoped>
.tableBottom {
    text-align: center;
    position: relative;
    height: 50px;
    margin-top: 20px;
    .moreBtn {
        position: absolute;
        right: 50%;
        top: 10px;
    }
}
</style>

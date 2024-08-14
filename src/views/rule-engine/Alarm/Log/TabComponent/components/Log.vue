<template>
    <a-table
        :dataSource="dataSource"
        :columns="columns"
        :pagination="false"
        bordered
        :scroll="{ y: 'calc(100vh - 300px)' }"
    >
        <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'alarmTime'"
                ><span
                    >{{ dayjs(text).format('YYYY-MM-DD HH:mm:ss')
                    }}</span
            ></template>
            <template v-if="column.dataIndex === 'sourceId'">
                <Ellipsis>
                    {{ $t('components.Log.891327-0') }}
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
            <template v-if="column.dataIndex === 'action'">
                <a-button type="link" @click="() => showDetail(record)">
                        <template #icon>
                            <AIcon type="EyeOutlined"></AIcon>
                        </template> </a-button>
            </template>
        </template></a-table
    >
    <div class="tableBottom">
        <a-button
            v-if="exceed"
            class="moreBtn"
            type="link"
            @click="gotoAlarmLog"
            >{{ $t('components.Log.891327-1') }} ></a-button
        >
        <span v-else-if="dataSource.length">{{ $t('components.Log.891327-2') }}</span>
    </div>
    <LogDetail v-if="visibleDetail" :data="current" @close="close" />
</template>

<script setup>
import { queryLogList } from '@/api/rule-engine/log';
import dayjs from 'dayjs';
import { useMenuStore } from 'store/menu';
import LogDetail from './LogDetail.vue';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
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
        title: $t('components.Log.891327-3'),
        dataIndex: 'alarmTime',
        key: 'alarmTime',
    },
    {
        title: $t('components.Log.891327-4'),
        dataIndex: 'triggerDesc',
        key: 'triggerDesc',
    },
    {
        title: $t('components.Log.891327-5'),
        dataIndex: 'sourceId',
        key: 'sourceId',
    },
    {
        title: $t('components.Log.891327-6'),
        dataIndex: 'actualDesc',
        key: 'actualDesc',
    },
    {
        title: $t('components.Log.891327-7'),
        dataIndex: 'action',
        key: 'action',
        width:100
    }
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
    margin-top: 20px;
    .moreBtn {
        position: absolute;
        right: 50%;
        top: 10px;
    }
}
.deviceId {
    cursor: pointer;
    color:#4096FF;
}
</style>

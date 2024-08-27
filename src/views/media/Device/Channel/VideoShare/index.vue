<template>
    <a-modal
        title="视频分享"
        visible
        @cancel="emit('close')"
        :maskClosable="false"
        width="900px"
    >
        <div class="top">
            <span>有效期：</span>
            <a-input-number
                v-if="isEdit"
                style="width: 200px"
                :precision="0"
                :min="1"
                v-model:value="expires"
            >
                <template #addonAfter>
                    <a-select
                        v-model:value="unit"
                        :options="[
                            { label: '秒', value: 'seconds' },
                            { label: '分', value: 'minutes' },
                            { label: '小时', value: 'hours' },
                        ]"
                    />
                </template>
            </a-input-number>
            <div v-else>{{ expires }}{{ unitMap.get(unit) }}</div>
            <PermissionButton
                type="link"
                :hasPermission="true"
                @click="onClick"
            >
                <AIcon :type="isEdit ? 'CheckOutlined' : 'EditOutlined'" />
            </PermissionButton>
        </div>
        <a-table
            :columns="columns"
            :dataSource="dataSource"
            :pagination="false"
        >
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'actions'">
                    <a-button type="link" @click="onCopy(record)"
                        >复制链接</a-button
                    >
                </template>
            </template>
        </a-table>
        <template #footer>
            <a-button type="primary" @click="emit('close')">确定</a-button>
        </template>
    </a-modal>
</template>

<script setup lang="ts" name="Address">
import DeviceApi from '@/api/media/device';
import { onMounted, ref } from 'vue';
import { onlyMessage } from '@/utils/comm';

const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
});
const emit = defineEmits(['close']);
const types = ['flv', 'hls', 'mp4', 'rtmp', 'rtsp', 'rtc'];
const unitMap = new Map();
unitMap.set('seconds', '秒');
unitMap.set('minutes', '分');
unitMap.set('hours', '小时');

const unit = ref('hours');
const expires = ref(1);
const dataSource = ref<any[]>([]);
const isEdit = ref(false);

const columns = [
    {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        ellipsis: true,
        width: 70,
    },
    {
        title: '链接',
        dataIndex: 'url',
        key: 'url',
        ellipsis: true,
    },
    {
        title: '操作',
        key: 'actions',
        width: 100,
    },
];

const handleResult = async (params?: any) => {
    const res = await DeviceApi.getShare(
        props.data.deviceId,
        props.data.channelId,
        params
            ? params
            : {
                  expires: 3600,
              },
    );
    if (res.success) {
        dataSource.value = types.map((item) => ({
            id: item,
            type: item,
            url: res.result[item],
        }));
    }
};

const onCopy = (record) => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(record.url);
        onlyMessage('复制成功！');
    } else {
        const input = document.createElement('input');
        input.value = JSON.stringify(record.url);
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        onlyMessage('复制成功！');
    }
};

const onClick = () => {
    isEdit.value = !isEdit.value;
    if (!isEdit.value) {
        handleResult({
            expires:
                unit.value === 'hours'
                    ? expires.value * 3600
                    : unit.value === 'minutes'
                    ? expires.value * 60
                    : expires.value,
        });
    }
};

onMounted(() => {
    handleResult();
});
</script>

<style lang="less" scoped>
.top {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
}
</style>

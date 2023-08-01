<template>
    <j-table
        size="small"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :scroll="{ y: 200 }"
    >
        <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'actions'">
                <j-button
                    type="link"
                    style="padding: 0"
                    v-if="!record.flag"
                    :disabled="loading"
                    @click="onSetting(record)"
                    >设置</j-button
                >
                <template v-else>
                    <j-space>
                        <j-button
                            danger
                            type="link"
                            :disabled="loading"
                            style="padding: 0"
                            @click="onDelete(record)"
                            >删除</j-button
                        >
                        <j-button
                            type="link"
                            :disabled="loading"
                            style="padding: 0"
                            @click="onInvoke(record)"
                            >调用</j-button
                        >
                    </j-space>
                </template>
            </template>
            <!-- <template v-else-if="column.dataIndex === 'name'">
                <j-input :value="record[column.dataIndex]" />
            </template> -->
            <template v-else>
                {{ record[column.dataIndex] }}
            </template>
        </template>
    </j-table>
</template>

<script lang="ts" setup>
import channelApi from '@/api/media/channel';
import { onlyMessage } from '@/utils/comm';
import { isNumber } from 'lodash-es';
import { PropType } from 'vue';

type Item = { id: string | number; name: string; flag?: boolean };
const props = defineProps({
    data: {
        type: Object as PropType<Partial<Record<string, any>>>,
        default: () => ({}),
    },
});

const columns = [
    {
        title: '序号',
        dataIndex: 'id',
        width: 60,
    },
    {
        title: '预置点位',
        dataIndex: 'name',
    },
    {
        title: '操作',
        dataIndex: 'actions',
        width: 90,
    },
];

const init = new Array(50).fill(0).map((_, index) => {
    return {
        id: String(index + 1),
        name: `预置点${index + 1}`,
        flag: false,
    };
});

const dataSource = ref<Item[]>(init);
const loading = ref(false)

const handleSearch = (id: string) => {
    channelApi.opFunction(id, 'QueryPreset').then((resp) => {
        if (resp.status === 200) {
            dataSource.value = init.map((item) => {
                const _item = (resp.result?.[0] || []).find(
                    (i: any) => i.id === item.id,
                );
                if (_item) {
                    return {
                        ..._item,
                        flag: true,
                    };
                }
                return item;
            });
        }
    });
};

const onFunction = (id: string, functionId: string, params: any) => {
    loading.value = true
    channelApi.opFunction(id, functionId, params).then((resp) => {
        if (resp.status === 200) {
            onlyMessage('操作成功！')
            if (props.data?.deviceId) {
                handleSearch(props.data?.deviceId);
            }
        }
    }).finally(() => {
        loading.value = false
    })
};

const onSetting = (obj: Item) => {
    if (!obj.id) return;
    const params = {
        operation: 'SET',
        presetIndex: isNumber(obj.id) ? Number(obj.id) : obj.id,
        channel: props.data?.channelId,
    };
    onFunction(props.data?.deviceId, 'Preset', params);
};

const onInvoke = (obj: Item) => {
    if (!obj.id) return;
    const params = {
        operation: 'CALL',
        presetIndex: isNumber(obj.id) ? Number(obj.id) : obj.id,
        channel: props.data?.channelId,
    };
    onFunction(props.data?.deviceId, 'Preset', params);
};

const onDelete = (obj: Item) => {
    if (!obj.id) return;
    const params = {
        operation: 'DEL',
        presetIndex: isNumber(obj.id) ? Number(obj.id) : obj.id,
        channel: props.data?.channelId,
    };
    onFunction(props.data?.deviceId, 'Preset', params);
};

watch(
    () => props.data.deviceId,
    () => {
        if (props.data?.deviceId) {
            handleSearch(props.data?.deviceId);
        }
    },
    {
        immediate: true,
    },
);
</script>
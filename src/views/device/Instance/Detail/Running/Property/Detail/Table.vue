<template>
    <div>
        <j-table
            :columns="columns"
            size="small"
            rowKey="id"
            :dataSource="dataSource?.data"
            @change="onChange"
            :pagination="{
                current: (dataSource?.pageIndex || 0) + 1,
                pageSize: dataSource?.pageSize || 12,
                showSizeChanger: true,
                showLessItems:true,
                total: dataSource?.total || 0,
                pageSizeOptions: ['12', '24', '48', '96']
            }"
        >
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'timestamp'">
                    {{ moment(record.timestamp).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
                <template v-if="column.key === 'value'">
                    <ValueRender
                        type="table"
                        :data="_props.data"
                        :value="{ ...record }"
                    />
                </template>
                <template v-else-if="column.key === 'action'">
                    <j-space>
                        <j-button
                            v-if="
                                showLoad ||
                                (!getType(record?.value) &&
                                    data?.valueType?.fileType === 'base64')
                            "
                            type="link"
                            @click="_download(record)"
                            ><AIcon type="DownloadOutlined"
                        /></j-button>
                        <j-button type="link" @click="showDetail(record)"
                            ><AIcon type="SearchOutlined"
                        /></j-button>
                    </j-space>
                </template>
            </template>
        </j-table>
    </div>
    <j-modal
        title="详情"
        :visible="visible"
        @ok="visible = false"
        @cancel="visible = false"
    >
        <div>自定义属性</div>
        <JsonViewer
            v-if="
                data?.valueType?.type === 'object' ||
                data?.valueType?.type === 'array'
            "
            :expand-depth="5"
            :value="current.formatValue"
        />
        <j-textarea
            v-else-if="data?.valueType?.type === 'file'"
            :value="current.formatValue"
            :row="3"
        />
        <j-input v-else disabled :value="current.formatValue" />
    </j-modal>
</template>

<script lang="ts" setup>
import { getPropertyData } from '@/api/device/instance';
import { useInstanceStore } from '@/store/instance';
import encodeQuery from '@/utils/encodeQuery';
import moment from 'moment';
import { getType } from '../index';
import ValueRender from '../ValueRender.vue';
import JsonViewer from 'vue-json-viewer';

const _props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
    time: {
        type: Array,
        default: () => [],
    },
});

const instanceStore = useInstanceStore();
const dataSource = ref({
    pageIndex: 0,
    pageSize: 12,
    data: [],
    total: 0
});
const current = ref<any>({});
const visible = ref<boolean>(false);

const columns = computed(() => {
    const arr: any[] = [
        {
            title: '时间',
            dataIndex: 'timestamp',
            key: 'timestamp',
            ellipsis: true,
        },
        {
            title: _props.data?.name || '',
            dataIndex: 'value',
            key: 'value',
            ellipsis: true,
        },
    ];
    if (_props.data?.valueType?.type != 'geoPoint') {
        arr.push({
            title: '操作',
            dataIndex: 'action',
            key: 'action',
        });
    }
    return arr;
});

const showLoad = computed(() => {
    return (
        _props.data.valueType?.type === 'file' &&
        _props.data?.valueType?.fileType === 'Binary(二进制)'
    );
});

const showDetail = (item: any) => {
    visible.value = true;
    current.value = item;
};

const queryPropertyData = async (params: any) => {
    const resp = await getPropertyData(
        instanceStore.current.id,
        encodeQuery({
            ...params,
            terms: {
                property: _props.data.id,
                timestamp$BTW: _props.time,
            },
            sorts: { timestamp: 'desc' },
        }),
    );
    if (resp.status === 200) {
        dataSource.value = resp.result as any;
    }
};

watch(
    () => [_props.data.id, _props.time],
    ([newVal]) => {
        if (newVal && _props.time?.length) {
            queryPropertyData({
                pageSize: 12,
                pageIndex: 0,
            });
        }
    },
    {
        deep: true, immediate: true
    }
);

const onChange = (page: any) => {
    queryPropertyData({
        pageSize: page.pageSize,
        pageIndex: Number(page.current) - 1 || 0,
    });
};

const _download = (record: any) => {
    const downNode = document.createElement('a');
    downNode.download = `${instanceStore.current.name}-${
        _props.data.name
    }${moment(new Date().getTime()).format('YYYY-MM-DD-HH-mm-ss')}.txt`;
    downNode.style.display = 'none';
    //字符串内容转成Blob地址
    const blob = new Blob([record.value]);
    downNode.href = URL.createObjectURL(blob);
    //触发点击
    document.body.appendChild(downNode);
    downNode.click();
    //移除
    document.body.removeChild(downNode);
};
</script>

<style lang="less" scoped>
:deep(.ant-pagination-item) {
    display: none !important;
}
:deep(.ant-pagination-jump-next){
    display: none !important;
}
</style>
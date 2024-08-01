<!-- 通知记录 -->
<template>
    <j-modal visible title="通知记录" :footer="null" width="70%" @cancel="emit('cancel')">
        <pro-search type="simple" :columns="columns" @search="handleSearch" />

        <JProTable
            ref="logRef"
            model="table"
            :columns="columns"
            :request="(e) => templateApi.getHistory(e, data.id)"
            :defaultParams="{
                sorts: [{ name: 'notifyTime', order: 'desc' }],
                terms: [{ column: 'notifyType$IN', value: data.type }],
            }"
            :params="params"
        >
            <template #notifyTime="slotProps">
                {{ moment(slotProps.notifyTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template #state="slotProps">
                <j-space>
                    <j-badge
                        :status="slotProps.state.value"
                        :text="slotProps.state.text"
                    ></j-badge>
                    <AIcon
                        v-if="slotProps.state.value === 'error'"
                        type="ExclamationCircleOutlined"
                        style="color: #1d39c4; cursor: pointer"
                        @click="handleError(slotProps.errorStack)"
                    />
                </j-space>
            </template>
            <template #action="slotProps">
                <AIcon
                    type="ExclamationCircleOutlined"
                    :class="Object.keys(slotProps.context).length == 0 ? 'disableIcon' : 'Icon'"
                    @click="handleDetail(slotProps)"
                />
            </template>
        </JProTable>
    </j-modal>
</template>

<script setup lang="ts">
import templateApi from '@/api/notice/template';
import { PropType } from 'vue';
import moment from 'moment';
import { Modal } from 'jetlinks-ui-components';
import Record from './components/Record.vue'
type Emits = {
    (e: 'update:visible', data: boolean): void;
    (e: 'cancel'): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    visible: { type: Boolean, default: false },
    data: {
        type: Object as PropType<Partial<Record<string, any>>>,
        default: () => ({}),
    },
});

const _vis = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
});

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        search: {
            type: 'string',
        },
    },
    {
        title: '发送时间',
        dataIndex: 'notifyTime',
        key: 'notifyTime',
        scopedSlots: true,
        search: {
            type: 'date',
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '成功', value: 'success' },
                { label: '失败', value: 'error' },
            ],
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: '操作',
        key: 'action',
        scopedSlots: true,
    },
];

const params = ref<Record<string, any>>({});

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};

/**
 * 查看错误信息
 */
const handleError = (e: any) => {
    Modal.info({
        title: '错误信息',
        content: h(
            'p',
            {
                style: {
                    maxHeight: '300px',
                    overflowY: 'auto',
                },
            },
            JSON.stringify(e),
        ),
    });
};
/**
 * 查看详情
 */
 const handleDetail = (data: any) => {
    if(Object.keys(data.context).length == 0){
        Modal.info({
        title: '详情信息',
        content: h(
            "p",
            {

                style: {
                    maxHeight: '300px',
                    overflowY: 'auto',
                },
            },
            '模板中不存在变量'
        ),
    });
    }else{
        Modal.info({
        title: '详情信息',
        content: h(
            Record,
            {
                data:data,
                style: {
                    maxHeight: '300px',
                    overflowY: 'auto',
                },
            },
        ),
    });
    }
};

watch(
  () => _vis.value,
  (val) => {
    if (val) {
      handleSearch({ terms: [] })
    } else {
      params.value = {}
    }
  },
);

</script>
<style lang="less" scoped>
.disableIcon{
    color:darkgrey ;
    cursor:pointer;
}
.Icon{
    color:#1d39c4;
    cursor:pointer;
}
</style>

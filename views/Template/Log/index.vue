<!-- 通知记录 -->
<template>
    <a-modal open :title="$t('Log.index.017262-0')" :footer="null" width="70%" @cancel="emit('cancel')">
        <pro-search type="simple" :columns="columns" @search="handleSearch" />

        <JProTable
            ref="logRef"
            mode="TABLE"
            :columns="columns"
            :request="(e) => templateApi.getHistory(e, data.id)"
            :defaultParams="{
                sorts: [{ name: 'notifyTime', order: 'desc' }],
                terms: [{ column: 'notifyType$IN', value: data.type }],
            }"
            :params="params"
        >
            <template #notifyTime="slotProps">
                {{ dayjs(slotProps.notifyTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template #state="slotProps">
                <a-space>
                    <a-badge
                        :status="slotProps.state.value"
                        :text="slotProps.state.text"
                    ></a-badge>
                    <AIcon
                        v-if="slotProps.state.value === 'error'"
                        type="ExclamationCircleOutlined"
                        style="color: #1d39c4; cursor: pointer"
                        @click="handleError(slotProps.errorStack)"
                    />
                </a-space>
            </template>
            <template #action="slotProps">
                <AIcon
                    type="ExclamationCircleOutlined"
                    :class="Object.keys(slotProps.context).length == 0 ? 'disableIcon' : 'Icon'"
                    @click="handleDetail(slotProps)"
                />
            </template>
        </JProTable>
    </a-modal>
</template>

<script setup lang="ts">
import templateApi from '../../../api/template';
import { PropType } from 'vue';
import dayjs from 'dayjs';
import { Modal } from 'ant-design-vue';
import Record from './components/Record.vue'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
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
        title: $t('Log.index.017262-1'),
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
        title: $t('Log.index.017262-2'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: $t('Log.index.017262-3'), value: 'success' },
                { label: $t('Log.index.017262-4'), value: 'error' },
            ],
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: $t('Log.index.017262-5'),
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
        title: $t('Log.index.017262-6'),
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
        title: $t('Log.index.017262-7'),
        content: h(
            "p",
            {

                style: {
                    maxHeight: '300px',
                    overflowY: 'auto',
                },
            },
            $t('Log.index.017262-8')
        ),
    });
    }else{
        Modal.info({
        title: $t('Log.index.017262-7'),
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

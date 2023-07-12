<!-- 通知记录 -->
<template>
    <j-modal v-model:visible="_vis" title="通知记录" :footer="null" width="70%">
        <pro-search type="simple" :columns="columns" @search="handleSearch" />

        <JProTable
            ref="logRef"
            model="table"
            :columns="columns"
            :request="(e:any) => templateApi.getHistory(e, data.id)"
            :defaultParams="{
                pageSize: 5,
                sorts: [{ name: 'notifyTime', order: 'desc' }],
                terms: [{ column: 'notifyType$IN', value: data.type }],
            }"
            :params="params"
            :pagination="{
                pageSizeOptions: ['5', '10', '20', '50', '100'],
            }"
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
                    style="color: #1d39c4; cursor: pointer"
                    @click="handleDetail(slotProps.context,slotProps)"
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
import JsonViewer from 'vue-json-viewer';
type Emits = {
    (e: 'update:visible', data: boolean): void;
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

watch(
    () => _vis.value,
    (val) => {
        if (val) handleSearch({ terms: [] });
    },
);

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

const typeObj = {
    weixin: 'wechat',
    dingTalk: 'dingtalk',
};
/**
 * 查看用户名
 */
const userList = ref([])
const departmentList = ref([])
const queryUser = (id:any,notifyType:any,goal:any) =>{
    goal ==='user' ? templateApi.getUser(
        typeObj[notifyType],
        id,
    ).then((res:any)=>{
        if(res.status === 200){
            userList.value = res.result
        }
    }) : templateApi.getDept(typeObj[notifyType],
        id,).then((res:any)=>{
        if(res.status === 200){
            departmentList.value = res.result
        }
    })
}

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
const handleDetail =async (e: any,data:any) => {
    if(e.hasOwnProperty('userIdList')){
        await queryUser(data.notifierId,data.notifyType,'user')
        userList.value.forEach((item:any)=>{
            item.id === e.userIdList ? e.userIdList = item.name : ''
        })
    }
    if(e.hasOwnProperty('departmentIdList')){
       
    }
   
    Modal.info({
        title: '详情信息',
        content: h(
            JsonViewer,
            {
                value:JSON.stringify(e,null,1),
                expanded:"true",
                expandDepth:"4", 
                style: {
                    maxHeight: '300px',
                    overflowY: 'auto',
                },
            },
        ),
    });
};
</script>

<template>
    <a-modal visible :footer="null" width="70vw" @cancel="emit('close')" :centered="true" :maskClosable="false">
        <template #title>
            <span style="margin-right: 24px">{{ data.name }}</span>
            <j-badge
                :status="statusMap.get(instanceStore.current?.state?.value)"
            />
            {{ instanceStore.current?.state?.text }}
        
        </template>
        <div class="content">
            <a-tabs :options="tabList" v-model:activeKey="tabActiveKey">
                <a-tab-pane v-for="i in tabList" :key="i.value" :tab="i.label">
                </a-tab-pane>
            </a-tabs>
            <component :is="component[tabActiveKey]"  v-bind="{ type: 'device' }"/>
        </div>
    </a-modal>
</template>

<script setup name="DeviceDetail">
import { useInstanceStore } from '@/store/instance';
import Info from './Info/index.vue';
import Running from './Running/index.vue';
import Metadata from './Metadata/index.vue';
import Function from './Function/index.vue';
import Log from './Log/index.vue';
import { _detailByEdge } from '@/api/edge/batch';

const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
    type:{
        type: String,
        default: 'device'
    },
    edgeId: {
        type: String,
        default: '',
    }
});

const emit = defineEmits(['close']);
provide('_edgeId', props.edgeId)
const statusMap = new Map();
statusMap.set('online', 'success');
statusMap.set('offline', 'error');
statusMap.set('notActive', 'warning');

const instanceStore = useInstanceStore();
const tabActiveKey = ref('Info');
const initTabs = [
    {
        value: 'Info',
        label: '实例信息',
    },
    {
        value: 'Running',
        label: '运行状态',
    },
    {
        value: 'Metadata',
        label: '物模型',
    },
    {
        value: 'Function',
        label: '设备功能',
    },
    {
        value: 'Log',
        label: '日志管理',
    },
];


const component = {
  'Info': Info,
  'Running': Running,
  'Metadata': Metadata,
  'Function': Function,
  'Log': Log,
}

const getDetail = async (id) => {
   
    if(props.type === 'device'){
        await instanceStore.refresh(id);   
    }else{
       const res =  await _detailByEdge(props.edgeId,id);
       if(res.success){
           instanceStore.current = res.result
           instanceStore.detail = res.result
       }
    }
};

const tabList = ref([...initTabs]);

onMounted(() => {
    getDetail(props.data.id);
});

onUnmounted(() => {
//   instanceStore.current = {}
//   instanceStore.detail = {}
});
</script>

<style lang="less" scoped>
.content{
    height: 75vh;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>

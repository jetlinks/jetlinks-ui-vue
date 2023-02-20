<template>
    <page-container :tabList="list" @back="onBack" :tabActiveKey="instanceStore.active" @tabChange="onTabChange">
        <template #title>
            <div>
                <div style="display: flex;  align-items: center;">
                    <div>{{instanceStore.current.name}}</div>
                    <a-divider type="vertical" />
                    <a-space>
                        <a-badge :text="instanceStore.current.state?.text" :status="statusMap.get(instanceStore.current.state?.value)" />
                        <a-popconfirm title="确认启用设备" @confirm="handleAction" v-if="instanceStore.current.state?.value === 'notActive'">
                            <a-button type="link">启用设备</a-button>
                        </a-popconfirm>
                        <a-popconfirm title="确认断开连接" @confirm="handleDisconnect" v-if="instanceStore.current.state?.value === 'online'">
                            <a-button type="link">断开连接</a-button>
                        </a-popconfirm>
                        <a-tooltip v-if="instanceStore.current?.accessProvider === 'child-device' &&
            instanceStore.current?.state?.value === 'offline'"  :title="instanceStore.current?.features?.find((item) => item.id === 'selfManageState')
                      ? '该设备的在线状态与父设备(网关设备)保持一致'
                      : '该设备在线状态由设备自身运行状态决定，不继承父设备（网关设备）的在线状态'">
                            <AIcon type="QuestionCircleOutlined" style="font-size: 14px" />
                        </a-tooltip>
                    </a-space>
                </div>
                <div style="padding-top: 10px">
                    <a-descriptions size="small" :column="4">
                        <a-descriptions-item label="ID">{{ instanceStore.current.id }}</a-descriptions-item>
                        <a-descriptions-item label="所属产品">
                            <a-button style="margin-top: -5px; padding: 0" type="link" @click="jumpProduct">{{ instanceStore.current.productName }}</a-button>
                        </a-descriptions-item>
                    </a-descriptions>
                </div>
            </div>
        </template>
        <template #extra>
            <img @click="handleRefresh" :src="getImage('/device/button.png')" style="margin-right: 20px; cursor: pointer;" />
        </template>
        <component :is="tabs[instanceStore.tabActiveKey]" v-bind="{ type: 'device' }" @onJump="onTabChange" />
    </page-container>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '@/store/instance';
import Info from './Info/index.vue';
import Running from './Running/index.vue'
import Metadata from '../../components/Metadata/index.vue';
import ChildDevice from './ChildDevice/index.vue';
import Diagnose from './Diagnose/index.vue'
import Function from './Function/index.vue'
import { _deploy, _disconnect } from '@/api/device/instance'
import { message } from 'ant-design-vue';
import { getImage } from '@/utils/comm';

const route = useRoute();
const instanceStore = useInstanceStore()

const statusMap = new Map();
statusMap.set('online', 'success');
statusMap.set('offline', 'error');
statusMap.set('notActive', 'warning');

const list = [
    {
        key: 'Info',
        tab: '实例信息'
    },
    {
        key: 'Running',
        tab: '运行状态'
    },
    {
        key: 'Metadata',
        tab: '物模型'
    },
    {
        key: 'Function',
        tab: '设备功能'
    },
    {
        key: 'ChildDevice',
        tab: '子设备'
    },
    {
        key: 'Diagnose',
        tab: '设备诊断'
    },
]

const tabs = {
  Info,
  Metadata,
  Running,
  ChildDevice,
  Diagnose,
  Function
}

watch(
    () => route.params.id,
    (newId) => {
        if(newId){
            instanceStore.tabActiveKey = 'Info'
            instanceStore.refresh(newId as string)
        }
    },
    {immediate: true, deep: true}
);

const onBack = () => {

}

const onTabChange = (e: string) => {
    instanceStore.tabActiveKey = e
}

const handleAction = async () => {
    if(instanceStore.current.id){
        const resp = await _deploy(instanceStore.current.id)
        if(resp.status === 200){
            message.success('操作成功！')
            instanceStore.refresh(instanceStore.current.id)
        }
    }
}

const handleDisconnect = async () => {
    if(instanceStore.current.id){
        const resp = await _disconnect(instanceStore.current.id)
        if(resp.status === 200){
            message.success('操作成功！')
            instanceStore.refresh(instanceStore.current.id)
        }
    }
}

const handleRefresh = async () => {
    if(instanceStore.current.id){
        await instanceStore.refresh(instanceStore.current.id)
        message.success('操作成功')
    }
}

const jumpProduct = () => {
    message.warn('暂未开发')
}
</script>
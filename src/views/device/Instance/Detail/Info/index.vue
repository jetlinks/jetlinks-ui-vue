<template>
    <j-card>
        <j-descriptions bordered>
            <template #title>
                设备信息
                <PermissionButton
                    type="link"
                    @click="visible = true"
                    hasPermission="device/Instance:update"
                >
                    <template #icon><AIcon type="EditOutlined" /></template>
                    编辑
                </PermissionButton>
            </template>
            <j-descriptions-item label="设备ID">{{
                instanceStore.current.id
            }}</j-descriptions-item>
            <j-descriptions-item label="产品名称">{{
                instanceStore.current.productName
            }}</j-descriptions-item>
            <j-descriptions-item label="产品分类">{{
                instanceStore.current.classifiedName
            }}</j-descriptions-item>
            <j-descriptions-item label="设备类型">{{
                instanceStore.current.deviceType?.text
            }}</j-descriptions-item>
            <j-descriptions-item label="固件版本">{{
                instanceStore.current?.firmwareInfo?.version
            }}</j-descriptions-item>
            <j-descriptions-item label="连接协议">{{
                instanceStore.current?.transport
            }}</j-descriptions-item>
            <j-descriptions-item label="消息协议">{{
                instanceStore.current.protocolName
            }}</j-descriptions-item>
            <j-descriptions-item label="创建时间">{{
                instanceStore.current.createTime
                    ? moment(instanceStore.current.createTime).format(
                          'YYYY-MM-DD HH:mm:ss',
                      )
                    : ''
            }}</j-descriptions-item>
            <j-descriptions-item label="注册时间">{{
                instanceStore.current.registerTime
                    ? moment(instanceStore.current.registerTime).format(
                          'YYYY-MM-DD HH:mm:ss',
                      )
                    : ''
            }}</j-descriptions-item>
            <j-descriptions-item label="最后上线时间">{{
                instanceStore.current.onlineTime
                    ? moment(instanceStore.current.onlineTime).format(
                          'YYYY-MM-DD HH:mm:ss',
                      )
                    : ''
            }}</j-descriptions-item>
            <j-descriptions-item
                label="父设备"
                v-if="
                    instanceStore.current.deviceType?.value === 'childrenDevice'
                "
                >{{ instanceStore.current.parentId }}</j-descriptions-item
            >
            <j-descriptions-item label="说明">{{
                instanceStore.current.description
            }}</j-descriptions-item>
        </j-descriptions>
        <Config />
        <Tags
            v-if="
                instanceStore.current?.tags &&
                instanceStore.current?.tags.length > 0
            "
        />
        <Relation
            v-if="
                instanceStore.current?.relations &&
                instanceStore.current?.relations.length > 0
            "
        />
        <Save
            v-if="visible"
            :data="instanceStore.current"
            @close="visible = false"
            @save="saveBtn"
        />
    </j-card>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '@/store/instance';
import Save from '../../Save/index.vue';
import Config from './components/Config/index.vue';
import Tags from './components/Tags/index.vue';
import Relation from './components/Relation/index.vue';
import moment from 'moment';

const visible = ref<boolean>(false);
const instanceStore = useInstanceStore();

const saveBtn = () => {
    if (instanceStore.current?.id) {
        instanceStore.refresh(instanceStore.current?.id);
    }
    visible.value = false;
};
</script>
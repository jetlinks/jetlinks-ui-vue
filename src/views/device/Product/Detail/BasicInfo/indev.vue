<!-- 配置信息 -->
<template>
    <a-card>
        <a-descriptions bordered>
            <template #title>
                <div style="display: flex">
                    <h3>配置信息</h3>
                    <div style="margin: 0 0px 0 15px; color: #1d39c4">
                        <edit-outlined @click="editConfig" />
                    </div>
                </div>
            </template>

            <a-descriptions-item label="ID">{{
                productStore.current.id
            }}</a-descriptions-item>
            <a-descriptions-item label="产品分类">{{
                productStore.current.classifiedName
            }}</a-descriptions-item>
            <a-descriptions-item label="设备类型">{{
                productStore.current.deviceType?.text
            }}</a-descriptions-item>

            <a-descriptions-item label="接入方式">
                <a-button type="link" @click="changeTables">{{
                    productStore.current.transportProtocol
                        ? productStore.current.transportProtocol
                        : '配置接入方式'
                }}</a-button>
            </a-descriptions-item>
            <a-descriptions-item label="创建时间">{{
                productStore.current.createTime
            }}</a-descriptions-item>
            <a-descriptions-item label="更新时间">{{
                productStore.current.modifyTime
            }}</a-descriptions-item>

            <a-descriptions-item label="说明" :span="3">
                {{ productStore.current.describe }}
            </a-descriptions-item>
        </a-descriptions>
    </a-card>
    <!-- 编辑 -->
    <Save ref="saveRef" :isAdd="isAdd" :title="title" />
</template>

<script lang="ts" setup>
import { useProductStore } from '@/store/product';
import Save from '../../Save/index.vue';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
} from '@ant-design/icons-vue';
const productStore = useProductStore();
const saveRef = ref();
const isAdd = ref(2);
const title = ref('编辑');
// console.log(productStore.current.deviceType.text, ' productStore');
/**
 * 编辑配置信息
 */
const editConfig = () => {
    saveRef.value.show(productStore.current);
};
/**
 * 切换tabs
 */
const changeTables = () => {
    productStore.tabActiveKey = 'Device';
};
</script>

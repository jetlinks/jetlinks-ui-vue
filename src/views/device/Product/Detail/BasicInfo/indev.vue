<!-- 配置信息 -->
<template>
    <j-card style="min-height: 100%">
        <j-descriptions bordered>
            <template #title>
                <div style="display: flex">
                    <h3>配置信息</h3>
                    <div style="margin: 0 0px 0 15px; color: #1d39c4">
                        <edit-outlined @click="editConfig" />
                    </div>
                </div>
            </template>

            <j-descriptions-item label="ID">{{
                productStore.current.id
            }}</j-descriptions-item>
            <j-descriptions-item label="产品分类">{{
                productStore.current.classifiedName
            }}</j-descriptions-item>
            <j-descriptions-item label="设备类型">{{
                productStore.current.deviceType?.text
            }}</j-descriptions-item>

            <j-descriptions-item label="接入方式">
                <j-button type="link" @click="changeTables">{{
                    productStore.current.accessName
                        ? productStore.current.accessName
                        : '配置接入方式'
                }}</j-button>
            </j-descriptions-item>
            <j-descriptions-item label="创建时间">{{
                moment(productStore.current.createTime).format('YYYY-MM-DD HH:mm:ss')
            }}</j-descriptions-item>
            <j-descriptions-item label="更新时间">{{
                moment(productStore.current.modifyTime).format('YYYY-MM-DD HH:mm:ss')
            }}</j-descriptions-item>

            <j-descriptions-item label="说明" :span="3">
                {{ productStore.current.describe }}
            </j-descriptions-item>
        </j-descriptions>
    </j-card>
    <!-- 编辑 -->
    <Save ref="saveRef" :isAdd="isAdd" :title="title"  @success="refresh"/>
</template>

<script lang="ts" setup>
import { useProductStore } from '@/store/product';
import Save from '../../Save/index.vue';
import moment from 'moment';
import { useRoute } from 'vue-router';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
} from '@ant-design/icons-vue';
const productStore = useProductStore();
const route = useRoute();
const saveRef = ref();
const isAdd = ref(2);
const title = ref('编辑');
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
/**
 * 修改成功刷新
 */
const refresh = () =>{
    productStore.refresh(route.params.id as string);
}
</script>

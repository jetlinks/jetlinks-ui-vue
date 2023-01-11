<template>
    <div class="box">
        <JTable 
            :columns="[
                {
                    title: '名称',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id',
                },
                {
                    title: '分类',
                    dataIndex: 'classifiedName',
                    key: 'classifiedName',
                },
            ]"
            :actions="actions"
            :request="request"
        >
            <template #headerTitle>
                <a-button type="primary">新增</a-button>
            </template>
            <template #cardRender="slotProps">
                <CardBox :actions="actions">
                    <template #content>
                        {{slotProps.item.name}}
                    </template>
                </CardBox>
            </template>
        </JTable>
    </div>
</template>

<script setup lang="ts">
import server from "@/utils/request";
import CardBox from '@/components/CardBox/index.vue';

const request = (data: any) => server.post(`/device-product/_query`, data)
const actions = [
    {
        key: 'edit',
        // disabled: true,
        text: "编辑"
    },
    {
        key: 'delete',
        disabled: true,
        text: "删除"
    }
]
</script>


<style lang="less" scoped>
.box {
    padding: 20px;
    background: #f0f2f5;
}
</style>


<template>
    <div class="box">
        <JTable 
            :columns="[
                {
                    title: '姓名',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '年龄',
                    dataIndex: 'age',
                    key: 'age',
                },
                {
                    title: '住址',
                    dataIndex: 'address',
                    key: 'address',
                }
            ]"
        >
            <template #headerTitle>
                <a-button type="primary">新增</a-button>
            </template>
            <template #cardRender="slotProps">
                {{slotProps.name}}
            </template>
        </JTable>
    </div>
</template>

<script setup lang="ts">
</script>


<style lang="less" scoped>
.box {
    padding: 20px;
    background: #f0f2f5;
}
</style>


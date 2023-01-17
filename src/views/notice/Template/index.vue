<!-- 通知模板 -->
<template>
    <div class="page-container">通知模板</div>
</template>

<script setup lang="ts">
import templateApi from '@/api/notice/template';

const getList = async () => {
    const res = await templateApi.list({
        current: 1,
        pageIndex: 0,
        pageSize: 12,
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [],
    });
    console.log('res: ', res);
};
getList();
</script>

<style lang="less" scoped></style>

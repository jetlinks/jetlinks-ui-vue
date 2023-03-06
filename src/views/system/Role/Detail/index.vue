<template>
    <page-container>
        <div class="details-container">
            <j-tabs v-model:activeKey="activeKey">
                <j-tab-pane key="1" tab="权限分配"><Permiss /></j-tab-pane>
                <j-tab-pane key="2" tab="用户管理"><User /></j-tab-pane>
            </j-tabs>
        </div>
    </page-container>
</template>

<script setup lang="ts" name="Detail">
import Permiss from './Permiss/index.vue';
import User from './User/index.vue';

const activeKey = ref('1');
</script>

<style lang="less" scoped>
.details-container {
    :deep(.ant-tabs-nav-wrap) {
        background-color: #fff;
        padding-left: 24px;
    }
}
</style>

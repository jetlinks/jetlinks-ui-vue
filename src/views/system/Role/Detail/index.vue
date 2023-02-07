<template>
    <div class="details-container">
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="权限分配"><Permiss /></a-tab-pane>
            <a-tab-pane key="2" tab="用户管理"><User /></a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup lang="ts" name="Detail">
import Permiss from './Permiss/index.vue';
import User from './User/index.vue';
const route = useRoute();

const activeKey = ref('1');
</script>

<style lang="less" scoped>
.details-container {
    


    :deep(.ant-tabs-nav-wrap) {
        background-color: #fff;
        padding: 24px 0 0 24px;
    }

    .role-permiss-container {
        padding: 24px;
    }
}

</style>

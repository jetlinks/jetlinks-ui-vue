<template>
    <div class="department-container">
        <a-card class="department-content">
            <div class="left">
                <LeftTree @change="id=>departmentId = id" />
            </div>
            <div class="right">
                <a-tabs v-model:activeKey="activeKey">
                    <a-tab-pane key="product" tab="产品">
                        <Product :parentId="departmentId" />
                    </a-tab-pane>
                    <a-tab-pane key="device" tab="设备">
                        <Device />
                    </a-tab-pane>
                    <a-tab-pane key="user" tab="用户">
                        <User />
                    </a-tab-pane>
                </a-tabs>
            </div>
        </a-card>
    </div>
</template>

<script setup lang="ts" name="Department">
import LeftTree from './components/LeftTree.vue';
import Product from './product/index.vue';
import Device from './device/index.vue';
import User from './user/index.vue';

const activeKey = ref<'product' | 'device' | 'user'>('product');

const departmentId = ref<string>('')
</script>

<style lang="less" scoped>
.department-container {
    padding: 24px;
    .department-content {
        :deep(.ant-card-body) {
            display: flex;

            .left {
                flex-basis: 300px;
            }
            .right {
                flex: 1 1 auto;
            }
        }
    }
}

</style>

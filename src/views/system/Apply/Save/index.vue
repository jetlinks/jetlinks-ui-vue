<template>
    <page-container>
        <div class="save-container">
            <j-row :gutter="24">
                <j-col :span="14">
                    <EditForm @change-apply-type="chengeType" />
                </j-col>
                <j-col :span="10"><Does :type="rightType" /></j-col>
            </j-row>
        </div>
    </page-container>
</template>

<script setup lang="ts">
import Does from './components/Does.vue';
import EditForm from './components/EditForm.vue';
import type { applyType } from './typing';

const rightType = ref<applyType>('internal-standalone');
const chengeType = (newType: applyType) => {
    rightType.value = newType;
};
</script>

<style lang="less" scoped>
.save-container {
    background-color: #fff;
    padding: 24px;
}
</style>

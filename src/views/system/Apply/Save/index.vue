<template>
    <j-page-container>
        <full-page :fixed="false">
            <div class="save-container">
                <div class="left">
                    <j-scrollbar>
                        <EditForm @change-apply-type="changeType" />
                    </j-scrollbar>
                </div>
                <div class="right"><Does :type="rightType" /></div>
            </div>
        </full-page>
    </j-page-container>
</template>

<script setup lang="ts">
import Does from './components/Does.vue';
import EditForm from './components/EditForm.vue';
import type { applyType } from './typing';

const rightType = ref<applyType>('internal-standalone');
const changeType = (newType: applyType) => {
    rightType.value = newType;
};
</script>

<style lang="less" scoped>
.save-container {
    padding: 24px;
    display: flex;
    gap: 24px;
    min-height: 100%;

    .left {
        flex: 1;
        height: calc(100vh - 166px);
    }

    .right {
        min-width: 410px;
        width: 33.33333%;
    }
}
</style>

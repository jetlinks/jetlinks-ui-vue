<template>
    <page-container>
        <a-card class="save-container">
            <a-row :gutter="24">
                <a-col :span="14">
                    <EditForm @change-apply-type="chengeType" />
                </a-col>
                <a-col :span="10"><Does :type="rightType" /></a-col>
            </a-row>
        </a-card>
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

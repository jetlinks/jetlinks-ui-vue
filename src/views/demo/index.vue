<!-- test demo -->
<template>
    <div class="page-container">
        父级: {{ testValue }}
        <ViewItem v-model="testValue" />
    </div>
</template>

<script setup lang="ts">
import ViewItem from '@/components/ValueItem/index.vue';

const testValue = ref('');
</script>

<style lang="less" scoped></style>

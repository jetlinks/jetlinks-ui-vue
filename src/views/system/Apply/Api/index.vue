<template>
    <page-container>
        <Api :mode="'appManger'" hasHome> 
        </Api>
    </page-container>
</template>

<script setup lang="ts" name="apiPage">
import Api from '@/views/system/Platforms/Api/index.vue';
</script>

<style scoped></style>

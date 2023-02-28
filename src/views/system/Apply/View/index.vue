<template>
    <page-container>
        <Api :mode="'appManger'" hasHome showTitle :code="code"> 
        </Api>
    </page-container>
</template>

<script setup lang="ts" name="apiPage">
import Api from '@/views/system/Platforms/Api/index.vue';
const route = useRoute()
const code = route.query.code as string
</script>

<style scoped></style>

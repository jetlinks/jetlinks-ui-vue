<template>
    <j-page-container>
        <Api :mode="'appManger'" hasHome :code="code" />
    </j-page-container>
</template>

<script setup lang="ts" name="apiPage">
import Api from '../../Platforms/Api/index.vue';
const route = useRoute()
const code = route.query.code as string
</script>

<style scoped></style>

<template>
    <div class="button-mange-container">

    </div>
</template>

<script setup lang="ts">

const route = useRoute();
const routeParams = {
    id: route.params.id === ':id' ? '' : route.params.id,
    ...route.query,
};
</script>

<style scoped>

</style>
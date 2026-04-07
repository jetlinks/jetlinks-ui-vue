<template>
  <DashboardPreviewTab :targetId="productId" />
</template>

<script setup lang="ts">
import DashboardPreviewTab from '../../../components/DashboardPreviewTab/index.vue'

const route = useRoute()
const productId = computed(() => String(route.params.id || ''))
</script>

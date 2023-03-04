<template>
    <div>
      <Action :thenOptions="data.branches ? data?.branches[0].then : []" :name="0" />
    </div>
</template>

<script lang="ts" setup>
import { useSceneStore } from '@/store/scene'
import Action from '../action/index.vue'
import { storeToRefs } from 'pinia';

const sceneStore = useSceneStore()
const { data } = storeToRefs(sceneStore)
</script>

<style scoped>

</style>
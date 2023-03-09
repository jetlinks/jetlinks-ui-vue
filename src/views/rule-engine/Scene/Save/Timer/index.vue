<template>
    <div>
        <Action
            :thenOptions="data.branches ? data?.branches[0].then : []"
            :name="0"
            @add="onActionAdd"
            @update="onActionUpdate"
        />
    </div>
</template>

<script lang="ts" setup>
import { useSceneStore } from '@/store/scene';
import Action from '../action/index.vue';
import { storeToRefs } from 'pinia';
import { ActionsType } from '@/components/Table';

const sceneStore = useSceneStore();
const { data } = storeToRefs(sceneStore);

const onActionAdd = (_data: ActionsType) => {
  console.log(_data)
    // if (data?.branches && _data) {
    //     const newThen = [...data?.branches?.[0].then, data];
    //     data.branches[0].then = newThen;
    // }
};

const onActionUpdate = (_data: ActionsType, type: boolean) => {
  console.log(_data, type)
};
</script>

<style scoped>
</style>
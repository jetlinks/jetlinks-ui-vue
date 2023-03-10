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
import { ActionsType } from '@/views/rule-engine/Scene/typings';

const sceneStore = useSceneStore();
const { data } = storeToRefs(sceneStore);

const onActionAdd = (_data: any) => {
    if (data.value?.branches && _data) {
      data?.value.branches?.[0].then.push(_data)
      console.log(data?.value.branches?.[0].then)
    }
};

const onActionUpdate = (_data: ActionsType, type: boolean) => {
  console.log(_data, type)
};
</script>

<style scoped>
</style>
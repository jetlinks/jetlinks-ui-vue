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

const sceneStore = useSceneStore();
const { data } = storeToRefs(sceneStore);

const onActionAdd = (_data: any) => {
    if (data.value?.branches && _data) {
        const newThen = [...data.value.branches[0].then, _data];
        data.value.branches![0].then = newThen
    }
};

const onActionUpdate = (_data: any, type: boolean) => {
    const indexOf = data.value.branches![0].then.findIndex(
        (item) => item.parallel === type,
    );
    if (indexOf !== -1) {
        if (_data?.actions?.length) {
            data.value.branches![0].then[indexOf] = _data;
        } else {
            data.value.branches![0].then[indexOf].actions = [];
        }
    }
};
</script>

<style scoped>
</style>
<template>
  <j-form-item
    :rules="actionRules"
    :name="['branches', 0, 'then']"
  >
    <Action
      :thenOptions="data.branches ? data?.branches[0].then : []"
      :name="0"
    />
  </j-form-item>
</template>

<script lang="ts" setup name='SceneSaveManual'>
import { useSceneStore } from '@/store/scene';
import { storeToRefs } from 'pinia';
import type { BranchesThen } from '@/views/rule-engine/Scene/typings'
import Action from '../action/index.vue';

const sceneStore = useSceneStore();
const { data } = storeToRefs(sceneStore);

const actionRules = [{
  validator(_: any, v?: BranchesThen[]) {
    console.log(_, v)
    if (!v || (v && !v.length) || (v && v.length && !v[0].actions.length)) {
      return Promise.reject('至少配置一个执行动作');
    }
    return Promise.resolve();
  },
}]

</script>

<style scoped>

</style>
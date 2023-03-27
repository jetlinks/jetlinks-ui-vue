<template>
  <div class='manual actions-branches-item'>
    <j-form-item
      :rules="actionRules"
      :name="['branches', 0, 'then']"
    >
      <Action
        :thenOptions="data.branches ? data?.branches[0].then : []"
        :name="0"
      />
    </j-form-item>
  </div>
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

    if (!v || (v && !v.length) || !v.some(item => item.actions && item.actions.length)) {
      return Promise.reject('至少配置一个执行动作');
    }
    return Promise.resolve();
  },
}]

</script>

<style scoped lang='less'>
@minWidth: 75%;

.manual {
  &.actions-branches-item {
    width: 100%;
  }
}


@media (min-width: 1600px) {
  .manual {
    &.actions-branches-item {
      width: @minWidth;
    }
  }
}
</style>
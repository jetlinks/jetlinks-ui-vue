<template>
  <div class='manual actions-branches-item'>
    <j-form-item>
      <template #label>
        <TitleComponent data='触发规则' style='font-size: 14px;' >
        </TitleComponent>
      </template>
      <AddButton
        style='width: 100%'
        :showCircular="false"
      >
        系统在接收到手动触发指令时，触发场景
      </AddButton>
    </j-form-item>
    <j-form-item
      :rules="actionRules"
      :name="['branches', 0, 'then']"
    >
      <template #label>
        <TitleComponent data='执行动作' style='font-size: 14px;' />
      </template>
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
import AddButton from '../components/AddButton.vue'

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

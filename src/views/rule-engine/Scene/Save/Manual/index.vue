<template>
  <div class='manual actions-branches-item'>
    <j-form-item>
      <template #label>
        <TitleComponent :data="$t('Manual.index.5425710-0')" style='font-size: 14px;' >
        </TitleComponent>
      </template>
      <AddButton
        style='width: 100%'
        :showCircular="false"
      >
        {{ $t('Manual.index.5425710-1') }}
      </AddButton>
    </j-form-item>
    <j-form-item
      :rules="actionRules"
      :name="['branches', 0, 'then']"
    >
      <template #label>
        <TitleComponent :data="$t('Manual.index.5425710-2')" style='font-size: 14px;' />
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const sceneStore = useSceneStore();
const { data } = storeToRefs(sceneStore);

const actionRules = [{
  validator(_: any, v?: BranchesThen[]) {

    if (!v || (v && !v.length) || !v.some(item => item.actions && item.actions.length)) {
      return Promise.reject($t('Manual.index.5425710-3'));
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

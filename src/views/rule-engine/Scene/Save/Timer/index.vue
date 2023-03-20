<template>
    <div class='timer'>
      <j-form-item
        :rules="rules"
        name="timer"
      >
        <template #label>
          <TitleComponent data='触发规则' style='font-size: 14px;' />
        </template>
        <AddButton
            style='width: 100%'
            @click='visible = true'
        >
          <Title :options='data.options.trigger' />
        </AddButton>
      </j-form-item>
      <j-form-item
        :rules="actionRules"
        :name="['branches', 0, 'then']"
      >
        <Action
            :thenOptions="data.branches ? data?.branches[0].then : []"
            :name="0"
        />
      </j-form-item>
      <AddModel
        v-if="visible"
        @cancel='visible = false'
        @save="save"
        :value="data.trigger.device"
        :options="data.options.trigger"
      />
    </div>
</template>

<script lang="ts" setup name='SceneSaveTimer'>
import { useSceneStore } from '@/store/scene';
import { storeToRefs } from 'pinia';
import Action from '../action/index.vue';
import AddModel from './AddModal.vue'
import AddButton from '../components/AddButton.vue'
import type { OperationTimer, BranchesThen } from '@/views/rule-engine/Scene/typings'

const sceneStore = useSceneStore();
const { data } = storeToRefs(sceneStore);
const visible = ref(false)

const rules = [{
  validator(_: any, v: any) {
    if (!v) {
      return Promise.reject(new Error('请配置定时触发规则'));
    }
    return Promise.resolve();
  },
}]

const actionRules = [{
  validator(_: any, v?: BranchesThen[]) {
    if (!v || (v && !v.length)) {
      return Promise.reject('至少配置一个执行动作');
    }
    return Promise.resolve();
  },
}]

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

const save = (_data: OperationTimer, options: Record<string, any>) => {
  data.value.trigger!.timer = _data
  data.value.options!.trigger = options
  visible.value = false
}
</script>

<style scoped>
</style>
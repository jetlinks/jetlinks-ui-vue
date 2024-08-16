<template>
  <j-form-item :name="name.concat(['type'])" v-show="false">
    <j-input v-model:value="value.type" disabled/>
  </j-form-item>
  <j-form-item :name="name.concat(['script'])">
    <f-rule-editor v-model:value="value.script" :id="id" :virtualRule="value"></f-rule-editor>
  </j-form-item>
  <template v-if="showWindow">
    <j-form-item :label="$t('VirtualRuleParam.index.4348430-0')" :name="name.concat(['isVirtualRule'])">
      <j-switch v-model:checked="value.isVirtualRule" :checked-value="true" :un-checked-value="false"
        @change="changeWindow"></j-switch>
    </j-form-item>
    <template v-if="value.isVirtualRule">
      <j-form-item :label="$t('VirtualRuleParam.index.4348430-1')" :name="name.concat(['windowType'])" :rules="[
        { required: true, message: $t('VirtualRuleParam.index.4348430-2') },
      ]">
        <j-select v-model:value="value.windowType" :options="windowTypeEnum" size="small" allow-clear></j-select>
      </j-form-item>
      <j-form-item :label="$t('VirtualRuleParam.index.4348430-3')" :name="name.concat(['aggType'])" :rules="[
        { required: true, message: $t('VirtualRuleParam.index.4348430-4') },
      ]">
        <j-select v-model:value="value.aggType" :options="aggTypeOptions" size="small" allow-clear></j-select>
      </j-form-item>
      <j-form-item :label="spanLabel" :name="name.concat(['window', 'span'])" :rules="[
        { required: true, message: $t('VirtualRuleParam.index.4348430-5') },
      ]">
        <j-input-number stringMode v-model:value="value.window.span" size="small" style="width: 100%;"></j-input-number>
      </j-form-item>
      <j-form-item :label="everyLabel" :name="name.concat(['window', 'every'])" :rules="[
        { required: true, message: $t('VirtualRuleParam.index.4348430-6') },
      ]">
        <j-input-number stringMode :maxlength="10" v-model:value="value.window.every" size="small" style="width: 100%;"></j-input-number>
      </j-form-item>
    </template>
  </template>
</template>
<script setup lang="ts" name="VirtualRuleParam">
import { PropType } from 'vue';
import FRuleEditor from '@/components/FRuleEditor/index.vue'
import { getStreamingAggType } from '@/api/device/product'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  },
  name: {
    type: Array as PropType<(string| number)[]>,
    default: () => ([])
  },
  id: String,
  showWindow: {
    type: Boolean,
    default: false
  }
})

interface Emits {
  (e: 'update:value', data: Record<any, any>): void;
}
const emit = defineEmits<Emits>()

onMounted(() => {
  if (!props.value.type) {
    emit('update:value', {
      ...props.value,
      type: 'script'
    })
  }
})

const aggTypeOptions = ref()
const getAggTypeList = async () => {
  aggTypeOptions.value = await getStreamingAggType().then((resp) =>
    resp.result.map((item: any) => ({
      label: `${item.value}(${item.text})`,
      value: item.value,
    })),
  );
}
getAggTypeList()

const changeWindow = (val: boolean | string | number) => {
  if (val as boolean) {
    props.value.type = 'window'
    if (!props.value.window) {
      props.value.window = {}
    }
  } else {
    props.value.type = 'script'
  }
}

const windowTypeEnum = [
  { label: $t('VirtualRuleParam.index.4348430-7'), value: 'time' },
  { label: $t('VirtualRuleParam.index.4348430-8'), value: 'num' },
]

const spanLabel = computed(() => {
  switch(props.value.windowType) {
    case 'time':
      return $t('VirtualRuleParam.index.4348430-9');
    case 'num':
      return $t('VirtualRuleParam.index.4348430-10');
    default:
      return $t('VirtualRuleParam.index.4348430-11')
  }
})

const everyLabel = computed(() => {
  switch(props.value.windowType) {
    case 'time':
      return $t('VirtualRuleParam.index.4348430-12');
    case 'num':
      return $t('VirtualRuleParam.index.4348430-13');
    default:
      return $t('VirtualRuleParam.index.4348430-14')
  }
})
</script>
<style lang="less" scoped></style>
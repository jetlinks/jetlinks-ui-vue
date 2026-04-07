<template>
  <a-form
      :model="formModel"
      ref="formRef"
      :layout="layout"
  >
    <template v-for="item in schema" :key="item.key">
      <a-form-item :label="item.label" :name="item.name" :rules="item.rules" validateFirst>
        <template v-if="item.slotName">
          <slot :name="item.slotName" :value="get(formModel, item.name)" :update="(val) => onUpdate(val, item.slotName)"></slot>
        </template>
        <template v-else>
          <ComponentItem :oldData="data" :data="formModel" v-bind="omit(item, ['slotName', 'label', 'rules'])"/>
        </template>
      </a-form-item>
    </template>
  </a-form>
</template>

<script setup>
import ComponentItem from "./ComponentItem.vue";
import {omit, get, set, cloneDeep} from "lodash-es";
import {reactiveAssign} from "./setting";

const props = defineProps({
  layout: {
    type: String,
    default: 'vertical'
  },
  schema: {
    type: Array,
    default: []
  },
  data: {
    type: Object,
    default: () => ({})
  }
})

const slots = useSlots()

const formModel = reactive({})
const formRef = ref()
let firstRun = true

const onUpdate = (val, name) => {
  set(formModel, name, val)
}
const initForm = (schema) => {
  // 重置formModel
  Object.keys(formModel).forEach(key => delete formModel[key]);
  schema.forEach(item => {
    set(formModel, item.name, undefined)
  });
};

watch(() => props.schema, () => {
  if (firstRun) {
    initForm(props.schema)
    firstRun = false
  }
}, {
  immediate: true,
  deep: true
})

watch(() => props.data, (val) => {
  reactiveAssign(formModel, cloneDeep(val || {}));
}, {
  immediate: true,
  deep: true
})

const onSave = () => {
  return new Promise(async (resolve) => {
    const resp = await formRef.value.validate()
    if (resp) {
      resolve(formModel)
    } else {
      resolve(false)
    }
  })
}

defineExpose({
  onSave
})
</script>

<style lang="less" scoped>

</style>

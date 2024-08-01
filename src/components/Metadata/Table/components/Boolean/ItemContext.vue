<template>
  <div class="boolean-items">
    <div class="boolean-item boolean-true">
      <div class="boolean-true-text">
        <a-input v-model:value="formData.trueText" @change="valueChange"/>
      </div>
      <span>-</span>
      <div class="boolean-true-value">
        <a-input v-model:value="formData.trueValue" @change="valueChange"/>
      </div>
    </div>
    <div class="boolean-item boolean-false">
      <div class="boolean-false-text">
        <a-input v-model:value="formData.falseText" @change="valueChange"/>
      </div>
      <span>-</span>
      <div class="boolean-false-value">
        <a-input v-model:value="formData.falseValue" @change="valueChange"/>
      </div>
    </div>
  </div>
</template>

<script setup name="BooleanItemContext">

const emits = defineEmits([
  'update:value',
  'change'
])

const props = defineProps({
  value: {
    type: Object,
    default: {}
  }
})

const formData = reactive({
  trueText: props.value?.trueText || '是',
  trueValue: props.value?.trueValue || 'true',
  falseText: props.value?.falseText || '否',
  falseValue: props.value?.falseValue || 'false',
});

const valueChange = () => {
  emits(`update:value`, formData)
  emits(`change`, formData)
}

watch(() => JSON.stringify(props.value), () => {
  formData.trueText = props.value?.trueText;
  formData.trueValue = props.value?.trueValue;
  formData.falseText = props.value?.falseText;
  formData.falseValue = props.value?.falseValue;
})

</script>

<style scoped lang="less">
.boolean-items {
  .boolean-item {
    display: flex;
    gap: 4px;
    align-items: center;

    > div {
      flex: 1;
      min-width: 0;
    }
  }

  .boolean-true {
    margin-bottom: 8px;
  }
}
</style>

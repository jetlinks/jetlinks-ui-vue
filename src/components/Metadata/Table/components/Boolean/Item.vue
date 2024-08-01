<template>
  <a-form-item
    label="布尔值"
    required
    :name="name"
    :rules="rules"
    :validate-first="true"
  >
    <Content
      v-model:value="myValue"
      @change="change"
    />
  </a-form-item>
</template>

<script setup name="MetadataBooleanItem">
import Content from './ItemContext.vue'

const emits = defineEmits([
  'update:value',
  'change'
])

const props = defineProps({
  value: {
    type: Object,
    default: () => ({}),
  },
  name: {
    type: String,
    default: 'value',
  },
});

const myValue = ref(props.value)

const rules = [{
  validator(_, v) {
    const isMax = Object.values(v).some(
      (item) => item.length > 64,
    );
    const isNull = Object.values(v).some((item) => !item);
    if (isMax) {
      return Promise.reject('最多可输入64个字符');
    }

    if (isNull) {
      return Promise.reject('请输入布尔值');
    }

    return Promise.resolve();
  }
}]

const change = () => {
  emits(`update:value`, myValue.value)
  emits(`change`, myValue.value)
}

watch(() => JSON.stringify(props.value), () => {
  myValue.value = props.value
})
</script>

<style scoped>

</style>

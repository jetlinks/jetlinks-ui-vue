<template>
  <a-form-item
    :label="$t('Boolean.Item.43486108-0')"
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

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
      return Promise.reject($t('Boolean.Item.43486108-1'));
    }

    if (isNull) {
      return Promise.reject($t('Boolean.Item.43486108-2'));
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

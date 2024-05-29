<template>
  <a-auto-complete
    v-model:value="myValue"
    :options="options"
    style="width: 100%;"
    @search="onSearch"
    @select="onSelect"
  />
</template>

<script setup name="MetadataGroup">

import {METADATA_GROUP_OPTIONS} from "../../consts";

const props = defineProps({
  value: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['update:value'])
const myValue = ref(props.value)
const searchValue = ref()

const groupSetting = inject(METADATA_GROUP_OPTIONS, {})

const options = computed(() => {
  if (searchValue.value) {
    let _options = (groupSetting.options.value || []).filter(item => {
      return item.value.includes(searchValue.value)
    })

    if (!_options.length) {
      _options.unshift({
        label: searchValue.value,
        value: searchValue.value
      })
    }
    return _options

  }

  return groupSetting.options.value || []
})

const onSearch = (value) => {
  searchValue.value = value
}

const onSelect = (value) => {
  groupSetting.addOptions({ label: value, value })
}

watch(() => props.value, () => {
  myValue.value = props.value
})
</script>

<style scoped>

</style>

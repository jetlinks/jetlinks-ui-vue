<template>
  <a-auto-complete
    v-model:value="myValue"
    :options="options"
    :placeholder="$t('Group.index.4348679-0')"
    style="width: 100%;"
    :getPopupContainer="(node) => tableWrapperRef || node"
    @search="onSearch"
    @select="onSelect"
  />
</template>

<script setup name="MetadataGroup">

import {METADATA_GROUP_OPTIONS} from "../../consts";
import {useTableWrapper} from "@/components/Metadata/Table/context";
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const props = defineProps({
  value: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['update:value', 'change'])
const myValue = ref(props.value)
const searchValue = ref()

const groupSetting = inject(METADATA_GROUP_OPTIONS, {})
const tableWrapperRef = useTableWrapper()

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
  emit('update:value', value)
  emit('change', value)
}

watch(() => props.value, () => {
  myValue.value = props.value
})
</script>

<style scoped>

</style>

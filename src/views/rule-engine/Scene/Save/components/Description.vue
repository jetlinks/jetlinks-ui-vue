<template>
  <div class="scene-description">
    <a-button type="primary" v-if="showAddBtn" @click="showEdit">
      <template #icon>
        <AIcon type="PlusOutlined"/>
      </template>
      {{ $t('components.Description.5425835-0') }}
    </a-button>
    <div class="scene-description-content" v-if="showEditBtn">
      <a-input v-model:value="myValue" show-count :maxlength="200" :placeholder="$t('components.Description.5425835-1')" style="flex: 1 1 0"/>
      <a-button @click="cancel">{{ $t('components.Description.5425835-2') }}</a-button>
      <a-button type="primary" @click="save">{{ $t('components.Description.5425835-3') }}</a-button>
    </div>
    <div class="scene-description-content " v-if="showDetail">
      <div style="max-width: calc(100% - 32px);">
        <Ellipsis>
          {{ myValue }}
        </Ellipsis>
      </div>
      <a-button type="link" @click="showEdit">
        <template #icon>
          <AIcon type="EditOutlined" style="font-size: 14px;"/>
        </template>
      </a-button>
    </div>
  </div>
</template>

<script setup name="Description">
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:value'])

const visible = ref()
const myValue = ref()

const showAddBtn = computed(() => {
  return !props.value && !visible.value
})

const showEditBtn = computed(() => {
  return visible.value
})

const showDetail = computed(() => {
  return props.value && !visible.value
})

const showEdit = () => {
  visible.value = true
}

const save = () => {
  visible.value = false
  emit('update:value', myValue.value)
}

const cancel = () => {
  visible.value = false
  myValue.value = props.value
}

watch(() => props.value, () => {
  myValue.value = props.value
}, { immediate: true })

</script>

<style scoped lang="less">
.scene-description {
  width: 100%;

  .scene-description-content {
    display: flex;
    gap: 8px;
    align-items: center;
  }
}
</style>

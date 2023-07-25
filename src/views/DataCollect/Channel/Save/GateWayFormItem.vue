<template>
  <j-button
      v-if="!value"
      style="width: 100%"
      @click="showModal"
  >
    选择网关设备
  </j-button>
  <div v-else class="gateway-form-item">
    <span>
      <j-ellipsis>
        {{ name }}
      </j-ellipsis>
    </span>
    <j-button type="link" @click="showModal">
      重新选择
    </j-button>
  </div>
  <DeviceModal
      v-if="visible"
      :name="name"
      :value="value"
      @cancel="cancel"
      @confirm="confirm"
  />
</template>

<script name="GateWayFormItem" setup>
import DeviceModal from './GateWayDeviceModal.vue'

const props = defineProps({
  value: {
    type: String,
    default: undefined
  },
  name: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['update:value', 'update:name'])

const visible = ref(false)

const showModal = () =>{
  visible.value = true
}

const cancel = () => {
  visible.value = false
}

const confirm = (select) => {
  console.log(select)
  emit('update:value', select.id)
  emit('update:name', select.name)
  cancel()
}

</script>

<style lang="less" scoped>
.gateway-form-item {
  display: flex;
  >span {
    line-height: 32px;
    max-width: calc(100% - 88px);
  }
}
</style>
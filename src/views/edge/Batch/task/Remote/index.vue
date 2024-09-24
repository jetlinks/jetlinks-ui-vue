<template>
  <div class="task-remote">
    <div class="gateway-items-warp">
      <div v-for="item in _options" :class="{ 'gateway-item':true, 'active': gatewaySelectedKey === item.value }">
        {{ item.label }}
      </div>
    </div>
    <div class="gateway-form">
      <a-form
        layout="vertical"
        ref="formRef"
        :model="formModel"
        :rules="rules"
      >
        <a-form-item label="推送方式" required>
          <CheckButton
            v-model:value="formModel.type"
            :options="[
                {label: '平台推送', value: 'plugin'},
                {label: '设备拉取', value: 'remote'},
              ]"
          />
        </a-form-item>
        <a-row :gutter="[16]">
          <a-col :span="8">
            <a-form-item label="响应超过时间" required>
              <a-input-number placeholder="请输入响应超过时间（秒）" style="width: 100%" >
                <template #addonAfter>
                  秒
                </template>
              </a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="升级超过时间" required>
              <a-input-number placeholder="请输入升级超过时间（秒）" style="width: 100%" >
                <template #addonAfter>
                  秒
                </template>
              </a-input-number>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="选择固件" required>
          <Firmware v-model:value="formModel.firmware" />
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup name="TaskRemote">
import Firmware from './Firmware.vue'

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  }
})

const formRef = ref()
const formModel = reactive({
  type: 'plugin',
  gateway: '',
  firmware: undefined
})
const gatewaySelectedKey = ref()

const _options = computed(() => props.options)

const rules = {

}

</script>

<style scoped lang="less">
.gateway-items-warp {
  display: flex;

  .gateway-form {

  }
}
</style>

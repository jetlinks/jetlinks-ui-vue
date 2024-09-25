<template>
  <a-modal
    visible
    title="批量操作"
    width="90%"
    okText="新增任务"
    @cancel="onCancel"
    @ok="onOk"
  >
    <div class="task-body">
      <div class="task-form">
        <a-form
          layout="vertical"
          ref="formRef"
          :model="formModel"
          :rules="rules"
        >
          <a-form-item label="名称" name="name">
            <a-input v-model:value="formModel.name" placeholder="请输入任务名称" />
          </a-form-item>
          <a-form-item name="gateway">
            <template #label>
              涉及网关
              <div class="form-label-extra gateway-list-label">
                <a-badge :count="gatewayList.length" />
                <a-button type="link" @click="openGatewayModal">选择</a-button>
              </div>
            </template>
            <GatewaySelect
              v-model:value="formModel.gateway"
              :options="gatewayList"
              @delete="gatewayListDelete"
            />
          </a-form-item>
          <a-form-item label="任务类型" name="type" required>
            <CheckButton
              v-model:value="formModel.type"
              :options="BatchOperateOptions"
            />
          </a-form-item>
          <a-form-item label="说明" name="description">
            <a-textarea
              placeholder="请输入说明"
            />
          </a-form-item>
        </a-form>
      </div>
      <div class="task-content">
        <ContentPlugin v-if="formModel.type === 'plugin'" :options="gatewayList" />
        <ContentRemote v-else-if="formModel.type === 'remote'" :options="gatewayList" />
      </div>
      <GatewayModal
        v-if="gatewayData.visible"
        :filter="gatewayList"
        @cancel="closeGatewayModal"
        @ok="addGateway"
      />
    </div>
  </a-modal>
</template>

<script setup name="TaskModal">
import GatewaySelect from './Gateway.vue'
import GatewayModal from './GatewayModal.vue'
import ContentPlugin from './Plugin/index.vue'
import ContentRemote from './Remote/index.vue'
import { BatchOperateOptions } from '../util'

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  },
  list: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['cancel', 'ok'])

const formRef = ref()
const pluginRef = ref()
const remoteRef = ref()
const formModel = reactive({
  name: '',
  gateway: '',
  type: undefined,
  description: undefined
})

const gatewayList = ref(props.list || [])

const gatewayData = reactive({
  visible: false,
  selectRow: []
})

const rules = {
  name: [
    { required: true, message: '请输入名称' },
    { max: 64, message: '最多可输入64位字符' },
  ],
  type: [
    {
      required: true,
      validator: (_rule, value) => {
        if (!value) {
          return Promise.reject('请选择任务类型');
        } else {
          return Promise.resolve();
        }
      },
    },
  ],
  gateway: [{
    required: true,
    validator: (_rule, value) => {
      if (!value.length) {
        return Promise.reject('请选择涉及网关');
      } else {
        return Promise.resolve();
      }
    },
  }],
  description: [
    { max: 200, message: '最多可输入200位字符', trigger: 'blur' },
  ],
}

const closeGatewayModal = () => {
  gatewayData.visible = false
  gatewayData.selectRow = []
}
const openGatewayModal = () => {
  gatewayData.visible = true
}

const addGateway = (rows) => {
  gatewayData.visible = false
  gatewayList.value.push(...rows.map(item => ({
    value: item.id,
    label: item.name,
    ...item
  })))
}

const gatewayListDelete = (id) => {
  gatewayList.value = gatewayList.value.filter(item => item.id !== id)
}

const onCancel = () => {
  emit('cancel')
}

const onOk = async () => {
  let validateStatus = false
  const formResp = await formRef.value.validate()

  if (!formResp) {

  }

  if (validateStatus) {
    emit('ok')
  }
}

const init = () => {
  const keys = Object.keys(props.value || {})
  if(keys.length) {
    keys.forEach(key => {
      if (key in toRaw(formModel)) {
        formModel[key] = props.value[key]
      }
    })
  }
}

init()

</script>

<style scoped lang="less">
.task-body {
  display: flex;
  gap: 24px;

  .task-form {
    width: 300px;
    padding-right: 12px;
    border-right: 1px solid #f1f1f1;
  }


  .task-content {
    flex: 1 1 0;
  }

  .form-label-extra {
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;
    gap: 24px;
    transform: translateX(calc(100% + 12px));
  }

  .gateway-list-label {
    width: 216px;
    justify-content: space-between;
  }
}
</style>

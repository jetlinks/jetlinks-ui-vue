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
          <a-form-item name="deviceId">
            <template #label>
              涉及网关
              <div class="form-label-extra gateway-list-label">
                <a-badge :count="gatewayList.length" />
                <a-button type="link" @click="openGatewayModal">选择</a-button>
              </div>
            </template>
            <GatewaySelect
              v-model:value="formModel.deviceId"
              :options="gatewayList"
              @delete="gatewayListDelete"
            />
          </a-form-item>
          <a-form-item label="任务类型" name="type" required>
            <CheckButton
              v-model:value="formModel.type"
              :options="batchOperateOptions"
              :beforeChange="batchOperateChange"
            />
          </a-form-item>
          <a-form-item label="说明" name="description">
            <a-textarea
              placeholder="请输入说明"
              :rows="4"
            />
          </a-form-item>
        </a-form>
      </div>
      <div class="task-content">
        <ContentPlugin v-if="formModel.type === 'plugin'" :options="gatewayList" />
        <ContentRemote v-else-if="formModel.type === 'remote'" :options="gatewayList" />
        <ContentChildren v-else-if="formModel.type === 'device'"  :options="gatewayList" :updateDevice="updateDevice" @change="onChildrenChange"/>
        <ContentAiModel v-else-if="formModel.type === 'AiModel'"  :options="gatewayList" @change="onChildrenChange"/>
        <ContentAiResource v-else-if="formModel.type === 'AiResource'"  :options="gatewayList" @change="onChildrenChange"/>
        <ContentCollectorTemplate v-else-if="formModel.type === 'CollectorTemplate'"  :options="gatewayList" @change="onChildrenChange"/>
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
import ContentChildren from './Children/index.vue'
import ContentAiModel from './AiModel/index.vue'
import ContentAiResource from './AiResource/index.vue'
import ContentCollectorTemplate from './CollectorTemplate/index.vue'
import { detail } from '@/api/device/instance';

import {useBatchOperateOptions} from "@/views/edge/Batch/util";
import {Modal} from "ant-design-vue";

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

const { batchOperateOptions } = useBatchOperateOptions()

const formRef = ref()
const formModel = reactive({
  name: '',
  deviceId: [],
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
  deviceId: [{
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

const updateDevice = (id) => {
  detail(id).then(resp => {
    if (resp.success) {
      gatewayList.value = gatewayList.value.map(item => {
        if (item.id) {
          item.state = resp.result.state
        }
        return item
      })
    }
  })
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
    return
  }

  if (validateStatus) {
    emit('ok')
  }
}

const batchOperateChange = (e) => {
  if (e === formModel.type) {
    return
  }

  return new Promise((resolve, reject) => {
    Modal.confirm({
      title: '切换任务类型会清空之前的数据',
      onOk() {
        resolve(true)
      },
      onCancel() {
        resolve(false)
      }
    })
  })
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

const onChildrenChange = (e)=>{
  console.log('eeeee====',e);
}

</script>

<style scoped lang="less">
.task-body {
  display: flex;
  gap: 24px;

  .task-form {
    width: 380px;
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
    width: 310px;
    justify-content: space-between;
  }
}
</style>

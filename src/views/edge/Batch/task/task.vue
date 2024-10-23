<template>
  <a-modal
    visible
    title="批量操作"
    width="90%"
    okText="新增任务"
    :confirmLoading="loading"
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
          <a-form-item name="thingList">
            <template #label>
              涉及网关
              <div class="form-label-extra gateway-list-label">
                <a-badge :count="formModel.thingList.length" />
                <a-button type="link" @click="openGatewayModal">选择</a-button>
              </div>
            </template>
            <GatewaySelect
              v-model:value="formModel.thingList"
            />
          </a-form-item>
          <a-form-item label="任务类型" name="jobType" required>
            <CheckButton
              v-model:value="formModel.jobType"
              :options="batchOperateOptions"
              :beforeChange="batchOperateChange"
            />
          </a-form-item>
          <a-form-item label="说明" name="description">
            <a-textarea
              v-model:value="formModel.description"
              placeholder="请输入说明"
              :rows="4"
            />
          </a-form-item>
        </a-form>
      </div>
      <div class="task-content">
        <ContentPlugin v-if="formModel.jobType === 'plugin'" ref="contentRef" :options="formModel.thingList" />
        <ContentRemote v-else-if="formModel.jobType === 'remote'" :options="formModel.thingList" />
        <ContentChildren v-else-if="formModel.jobType === 'device'"  :options="formModel.thingList" :updateDevice="updateDevice" @change="onChildrenChange"/>
        <ContentAiModel v-else-if="formModel.jobType === 'AiModel'"  :options="formModel.thingList" />
        <ContentAiResource v-else-if="formModel.jobType === 'AiResource'"  :options="formModel.thingList" />
        <ContentCollectorTemplate v-else-if="formModel.jobType === 'CollectorTemplate'"  :options="formModel.thingList" />
      </div>
      <GatewayModal
        v-if="gatewayData.visible"
        :filter="formModel.thingList"
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
import { createTask } from '@/api/edge/batch'
import { useRequest } from '@/hook'

import {useBatchOperateOptions} from "@/views/edge/Batch/util";
import {Modal} from "ant-design-vue";
import {onlyMessage} from "@/utils/comm";

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

const { loading, run } = useRequest( createTask, {
  immediate: false,
  onSuccess() {
    onCancel()
  }
})

const { batchOperateOptions } = useBatchOperateOptions()

const contentRef = ref()
const formRef = ref()
const formModel = reactive({
  name: '',
  jobType: undefined,
  thingList: props.list,
  description: undefined
})

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
  thingList: [{
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
      formModel.thingList = formModel.thingList.map(item => {
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
  formModel.thingList.push(...rows.map(item => ({
    value: item.id,
    label: item.name,
    ...item
  })))
}

const onCancel = () => {
  emit('cancel')
}

const onOk = async () => {
  const formResp = await formRef.value.validate()

  if (!formResp) {
    return
  }

  const commandArgs = await contentRef.value.getValue()

  if (!commandArgs.length) {
    onlyMessage('请选择插件', 'warning')
    return
  }

  const newThingList = formModel.thingList.map(item => {
    return {
      thingId: item.id,
      thingType: item.deviceType.value,
      thingName: item.name
    }
  })
  const newParams = {
    ...formModel,
    thingList: newThingList,
    commandArgs,
    resourceTotal: newThingList.length,
    serviceId: formModel.jobType === 'plugin' ? 'pluginService:driver' : '',
    commandId: 'SaveByTemplate'
  }

  run(newParams)
}

const batchOperateChange = (e) => {
  if (e === formModel.jobType) {
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

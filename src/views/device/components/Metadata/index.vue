<template>
  <j-card>
    <div class='device-detail-metadata' style="position: relative;">
      <div class="tips">
        <j-tooltip :title="instanceStore.detail?.independentMetadata && type === 'device'
        ? '该设备已脱离产品物模型，修改产品物模型对该设备无影响'
        : '设备会默认继承产品的物模型，修改设备物模型后将脱离产品物模型'">
          <div class="ellipsis">
            <AIcon type="InfoCircleOutlined" style="margin-right: 3px" />
            {{
              instanceStore.detail?.independentMetadata && type === 'device'
                ? '该设备已脱离产品物模型，修改产品物模型对该设备无影响'
                : '设备会默认继承产品的物模型，修改设备物模型后将脱离产品物模型'
            }}
          </div>
        </j-tooltip>
      </div>
      <j-tabs class="metadataNav" destroyInactiveTabPane type="card">
        <template #rightExtra>
          <j-space>
            <PermissionButton v-if="type === 'device' && instanceStore.detail?.independentMetadata"
              :hasPermission="`${permission}:update`" :popConfirm="{ title: '确认重置？', onConfirm: resetMetadata, }"
              :tooltip="{ title: '重置后将使用产品的物模型配置' }" key="reload">
              重置操作
            </PermissionButton>
            <PermissionButton :hasPermission="`${permission}:update`" @click="visible = true">快速导入</PermissionButton>
            <PermissionButton :hasPermission="`${permission}:update`" @click="cat = true">物模型TSL</PermissionButton>
          </j-space>
        </template>

        <j-tab-pane tab="属性定义" key="properties">
          <BaseMetadata :target="type" type="properties" :permission="permission" />
        </j-tab-pane>
        <j-tab-pane tab="功能定义" key="functions">
          <BaseMetadata :target="type" type="functions" :permission="permission" />
        </j-tab-pane>
        <j-tab-pane tab="事件定义" key="events">
          <BaseMetadata :target="type" type="events" :permission="permission" />
        </j-tab-pane>
        <j-tab-pane tab="标签定义" key="tags">
          <BaseMetadata :target="type" type="tags" :permission="permission" />
        </j-tab-pane>
      </j-tabs>
      <Import v-if="visible" v-model:visible="visible" :type="type" @close="visible = false" />
      <Cat v-model:visible="cat" @close="cat = false" :type="type" />
    </div>
  </j-card>
</template>
<script setup lang="ts" name="Metadata">
import PermissionButton from '@/components/PermissionButton/index.vue'
import { deleteMetadata } from '@/api/device/instance.js'
import { message } from 'ant-design-vue'
import { useInstanceStore } from '@/store/instance'
import Import from './Import/index.vue'
import Cat from './Cat/index.vue'
import BaseMetadata from './Base/index.vue'

const route = useRoute()
const instanceStore = useInstanceStore()
interface Props {
  type: 'product' | 'device';
  independentMetadata?: boolean;
}
const props = defineProps<Props>()

const permission = computed(() => props.type === 'device' ? 'device/Instance' : 'device/Product')
const visible = ref(false)
const cat = ref(false)

// 重置物模型
const resetMetadata = async () => {
  const { id } = route.params
  const resp = await deleteMetadata(id as string)
  if (resp.status === 200) {
    message.info('操作成功')
    instanceStore.refresh(id as string)
    // Store.set(SystemConst.REFRESH_DEVICE, true)
    // setTimeout(() => {
    //   Store.set(SystemConst.REFRESH_METADATA_TABLE, true)
    // }, 400)
  }
}
</script>
<style scoped lang="less">
.device-detail-metadata {
  .tips {
    // width: calc(100% - 670px);
    position: absolute;
    top: 12px;
    z-index: 1;
    margin-left: 420px;
    font-weight: 100;
  }

  .metadataNav {
    :deep(.ant-card-body) {
      padding: 0;
    }
  }
}
</style>
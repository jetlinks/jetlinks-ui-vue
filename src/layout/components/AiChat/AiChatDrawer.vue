<template>
  <a-drawer
      :open="true"
      @close="emits('close')"
      placement="right"
      width="520"
      :maskClosable="false"
      destroy-on-close
  >
    <template #title>
      <div style="display: flex; align-items: center; gap: 12px">
        <j-ellipsis>{{ activeAgent.others?.client?.name || 'AI助手' }}</j-ellipsis>
        <template v-if="agentList.length > 1">
          <j-ellipsis style="width: 100px">{{activeAgent.agentName || activeAgent.agentId}}</j-ellipsis>
          <a-dropdown>
            <div @click.prevent>
              <AIcon type="DownOutlined"/>
            </div>
            <template #overlay>
              <a-menu @click="onClick">
                <a-menu-item v-for="item in agentList" :key="item.agentId">
                  {{ item?.agentName || item.agentId }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </div>
    </template>
    <div class="ai-iframe-container">
      <component v-if="_component && activeAgent.agentId" :is="_component" :parameters="parameters"  :agent-id="activeAgent.agentId"/>
      <j-empty v-else/>
    </div>
  </a-drawer>
</template>

<script setup>
import {moduleRegistry} from "@/utils/module-registry";
import {getAgentDetailById} from "@/api/comm";

const props = defineProps({
  agentList: {
    type: Array,
    default: []
  },
  parameters: {
    type: Object,
    default: () => ({})
  }
})
const emits = defineEmits(['close'])
const activeAgent = ref({})
const _component = ref()
const aiChatStore = ref()

const getAgentDetail = (agentId) => {
  if (agentId && aiChatStore.value) {
    getAgentDetailById(agentId).then((res) => {
      if (res.status === 200) {
        aiChatStore.value.setAgentDetailData(agentId, res.result, new Date().getTime());
      }
    });
  }
}

const onClick = (e) => {
  const item = props.agentList.find((item) => item.agentId === e.key)
  if (item) {
    activeAgent.value = item
    getAgentDetail(item?.agentId)
  }
}

watch(() => [props.agentList, aiChatStore.value], () => {
  if (props.agentList.length > 0) {
    activeAgent.value = props.agentList[0]
    getAgentDetail(activeAgent.value?.agentId)
  }
}, {
  immediate: true
})

onMounted(() => {
  _component.value = moduleRegistry.getResourceItem('jetlinks-ai-agent-ui', 'components', 'AIChat');
  const useAiChatStore = moduleRegistry.getResourceItem('jetlinks-ai-agent-ui', 'stores', 'useAiChatStore')
  if (useAiChatStore) {
    aiChatStore.value = useAiChatStore()
  }
})
</script>

<style lang="less" scoped>
.ai-iframe-container {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>

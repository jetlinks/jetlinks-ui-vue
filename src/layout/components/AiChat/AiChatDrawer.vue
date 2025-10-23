<template>
  <a-drawer
      :open="true"
      @close="emits('close')"
      placement="right"
      width="520"
      :maskClosable="false"
      destroy-on-close
      style="background: linear-gradient(180deg, #E3EEFF 0%, #F9FAFB 100%)"
  >
    <template #title>
      <div style="display: flex; align-items: center; gap: 12px">
        <j-ellipsis>{{ activeAgent.others?.client?.name || 'AI助手' }}</j-ellipsis>
        <template v-if="agentList.length > 1">
          <j-ellipsis style="width: 100px">{{ activeAgent.agentName || activeAgent.agentId }}</j-ellipsis>
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
    <template #extra>
      <a-space>
        <a-tooltip title="开始新对话">
          <a-button @click="_handleReStartChat" size="small" type="text">
            <AIcon type="PlusOutlined"/>
          </a-button>
        </a-tooltip>
        <a-popover placement="bottomRight">
          <template #content>
            <div class="history-wrapper">
              <div
                  :class="['item', item.id === sessionId && 'active']"
                  v-if="historyList.length"
                  v-for="(item) in historyList"
                  :key="item.id"
              >
                <div class="description">
                  <div class="name" @click="getHistoryData(item.id)">
                    <j-ellipsis>{{ item.name }}</j-ellipsis>
                  </div>
                </div>

                <j-permission-button @click.stop :popConfirm="{
                    title: '是否确认删除该会话历史？',
                    onConfirm: () => handleDelHistory(item.id)
                  }" type="link" :hasPermission="`${ApplicationListPermission}:delete`">
                  <AIcon class="delete icon" type="DeleteOutlined"/>
                </j-permission-button>
              </div>

              <div v-else class="empty">
                <j-empty/>
              </div>
            </div>
          </template>
          <AIcon class="icon" type="HistoryOutlined"/>
        </a-popover>
      </a-space>
    </template>
<!--    <div style="display: flex; align-items: center; gap: 12px">-->
<!--      <template v-if="agentList.length > 1">-->
<!--        <j-ellipsis style="width: 100px">{{ activeAgent.agentName || activeAgent.agentId }}</j-ellipsis>-->
<!--        <a-dropdown>-->
<!--          <div @click.prevent>-->
<!--            <AIcon type="DownOutlined"/>-->
<!--          </div>-->
<!--          <template #overlay>-->
<!--            <a-menu @click="onClick">-->
<!--              <a-menu-item v-for="item in agentList" :key="item.agentId">-->
<!--                {{ item?.agentName || item.agentId }}-->
<!--              </a-menu-item>-->
<!--            </a-menu>-->
<!--          </template>-->
<!--        </a-dropdown>-->
<!--      </template>-->
<!--    </div>-->
    <div class="ai-iframe-container">
      <component
          v-if="_component && activeAgent.agentId"
          :is="_component"
          ref="aiChatRef"
          :initExpands="{
            clientId: activeAgent.clientId,
            clientType: activeAgent.clientType
          }"
          :parameters="parameters"
          :agent-id="activeAgent.agentId"
          :historyList="messageList"
          :sessionId="sessionId"
      />
      <j-empty v-else/>
    </div>
  </a-drawer>
</template>

<script setup>
import {moduleRegistry} from "@/utils/module-registry";
import {getAgentDetailById, getAgentHistoryList, delHistory, historyData} from "@/api/comm";
import {onlyMessage} from "@jetlinks-web/utils";

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
const historyList = ref([])
const messageList = ref([])
const sessionId = ref()
const aiChatRef = ref()
const ApplicationListPermission = 'applicationList';

const queryAgentHistoryList = (agentId) => {
  getAgentHistoryList(agentId, activeAgent.value?.clientType, activeAgent.value?.clientId).then((resp) => {
    if (resp.success) {
      historyList.value = resp.result || []
    }
  })
}

const getAgentDetail = (agentId) => {
  if (agentId && aiChatStore.value) {
    getAgentDetailById(agentId).then((res) => {
      if (res.status === 200) {
        aiChatStore.value.setAgentDetailData(agentId, res.result, new Date().getTime());
        queryAgentHistoryList(agentId)
      }
    });
  }
}

const getHistoryData = (_sessionId) => {
  sessionId.value = _sessionId;
  messageList.value = []

  const params = {
    'terms': [],
    'paging': false,
    'sorts': [{ name: 'timestamp', order: "asc" }]
  }
  historyData(_sessionId, params).then((res) => {
    if (res.status === 200) {
      let result = [];

      if (Array.isArray(res.result) && res.result.length > 0) {
        let content = '';

        res.result.forEach(item => {
          const session = JSON.parse(item.data);

          if (session.params.messageType === 'text') {
            result.push({
              id: Date.now().toString(),
              role: 'user',
              content: session?.params?.content,
              timestamp: new Date(),
            })
          } else if (session.type === 'session.response_start') {
            content = '';
          } else if (session.type === 'session.response_chunk') {
            const piece = session?.params?.chunk?.content ?? '';
            if (typeof piece === 'string') {
              content += piece;
            } else if (Array.isArray(piece)) {
              content += piece.join('');
            }
          } else if (session.type === 'session.response_end') {
            if (content.length > 0) {
              result.push({
                id: Date.now().toString(),
                role: 'ai',
                content: content,
                timestamp: new Date(),
              });
            }

            content = '';
          }
        })
      }

      messageList.value = result;

      if (aiChatRef.value) {
        aiChatRef.value.handleReStartChat(messageList.value);
      }
    }
  })
}

const onClick = (e) => {
  const item = props.agentList.find((item) => item.agentId === e.key)
  if (item) {
    activeAgent.value = item
    getAgentDetail(item?.agentId)
  }
}

const _handleReStartChat = () => {
  if (aiChatRef.value) {
    sessionId.value = '';
    messageList.value = [];
    aiChatRef.value.handleReStartChat([]);
    queryAgentHistoryList(activeAgent.value?.agentId)
  }
}

const handleDelHistory = (id) => {
  delHistory(id).then((res) => {
    if (res.success) {
      if(sessionId.value) {
        _handleReStartChat();
      } else {
        queryAgentHistoryList(activeAgent.value?.agentId)
      }
      onlyMessage('操作成功!')
    }
  })
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

.history-wrapper {
  width: 240px;
  max-height: 168px;
  overflow-y: auto;

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    font-size: 14px;
    line-height: 22px;
    padding: 5px 12px;
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.88);
    box-sizing: border-box;
    cursor: pointer;

    .description {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      min-width: 0;

      .name {
        width: 100%;
      }
    }

    .icon {
      position: relative;
      font-size: 16px;
    }

    .current {
      color: #52C41A;
    }

    .delete {
      color: #FF4D4F;
      display: none;
    }

    &:hover {
      .delete {
        display: block;
      }
    }
  }

  .active {
    background: #F5F5F5;
  }

  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}
</style>
